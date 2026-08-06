package com.reservation.reservation.service;

import com.reservation.auth.entity.User;
import com.reservation.auth.repository.UserRepository;
import com.reservation.auth.service.AuthService;
import com.reservation.common.exception.ResourceNotFoundException;
import com.reservation.common.exception.RoomUnavailableException;
import com.reservation.reservation.dto.request.CreateReservationRequest;
import com.reservation.reservation.dto.request.ReservationStatusRequest;
import com.reservation.reservation.dto.request.UpdateReservationRequest;
import com.reservation.reservation.dto.response.ReservationResponse;
import com.reservation.reservation.entity.Reservation;
import com.reservation.reservation.entity.ReservationStatus;
import com.reservation.reservation.mapper.ReservationMapper;
import com.reservation.reservation.repository.ReservationRepository;
import com.reservation.room.entity.Room;
import com.reservation.room.entity.RoomStatus;
import com.reservation.room.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.reservation.auth.entity.UserRole;
import org.springframework.security.access.AccessDeniedException;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;
    private final AuthService authService;

    @Override
    public ReservationResponse create(CreateReservationRequest request) {

        User user = getCurrentUser();

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Room",
                                "id",
                                request.getRoomId()));

        if (room.getStatus() != RoomStatus.AVAILABLE) {
            throw new RoomUnavailableException(
                    "Room is not available for reservation."
            );
        }

        validateReservationTime(
                request.getStartTime(),
                request.getEndTime()
        );
        validateBusinessHours(
                request.getStartTime(),
                request.getEndTime());
        validateReservationConflict(
                room,
                request.getReservationDate(),
                request.getStartTime(),
                request.getEndTime());

        Reservation reservation = reservationMapper.toEntity(request);

        reservation.setCustomer(user);
        reservation.setRoom(room);
        reservation.setStatus(ReservationStatus.PENDING);

        // Hitung total harga otomatis
        long hours = Duration.between(
                request.getStartTime(),
                request.getEndTime()
        ).toHours();

        reservation.setTotalPrice(
                room.getPrice().multiply(BigDecimal.valueOf(hours))
        );

        reservation = reservationRepository.save(reservation);

        return reservationMapper.toResponse(reservation);
    }

    @Override
    public ReservationResponse update(
            Long id,
            UpdateReservationRequest request
    ) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Reservation",
                                "id",
                                id));

        validateReservationAccess(reservation);

        // Tentukan room yang akan digunakan
        Room room = reservation.getRoom();

        if (request.getRoomId() != null &&
                !request.getRoomId().equals(room.getId())) {

            room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Room",
                                    "id",
                                    request.getRoomId()));
        }

        // Gunakan nilai baru jika dikirim, jika tidak gunakan nilai lama
        LocalDate reservationDate =
                request.getReservationDate() != null
                        ? request.getReservationDate()
                        : reservation.getReservationDate();

        LocalTime startTime =
                request.getStartTime() != null
                        ? request.getStartTime()
                        : reservation.getStartTime();

        LocalTime endTime =
                request.getEndTime() != null
                        ? request.getEndTime()
                        : reservation.getEndTime();

        // Validasi
        validateReservationTime(startTime, endTime);

        validateBusinessHours(startTime, endTime);

        validateReservationConflict(
                reservation.getId(),
                room,
                reservationDate,
                startTime,
                endTime
        );

        // Baru update entity
        reservationMapper.updateEntity(request, reservation);
        reservation.setRoom(room);

        // Hitung ulang total harga
        long hours = Duration.between(startTime, endTime).toHours();

        reservation.setTotalPrice(
                room.getPrice()
                        .multiply(BigDecimal.valueOf(hours))
        );

        reservation = reservationRepository.save(reservation);

        return reservationMapper.toResponse(reservation);
    }

    @Override
    public ReservationResponse getById(Long id) {

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Reservation",
                                "id",
                                id));


        validateReservationAccess(reservation);


        return reservationMapper.toResponse(reservation);
    }

    @Override
    public List<ReservationResponse> getAll() {

        return reservationRepository.findAll()
                .stream()
                .map(reservationMapper::toResponse)
                .toList();
    }

    @Override
    public List<ReservationResponse> getMyReservations() {

        User user = getCurrentUser();

        return reservationRepository.findByCustomer(user)
                .stream()
                .map(reservationMapper::toResponse)
                .toList();
    }

    @Override
    public ReservationResponse updateStatus(
            Long id,
            ReservationStatusRequest request
    ) {
        validateAdmin();

        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Reservation",
                                "id",
                                id));

        reservation.setStatus(request.getStatus());

        reservation = reservationRepository.save(reservation);

        return reservationMapper.toResponse(reservation);
    }

        @Override
        public void delete(Long id) {

            Reservation reservation = reservationRepository.findById(id)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Reservation",
                                    "id",
                                    id));

            validateReservationAccess(reservation);

            reservationRepository.delete(reservation);
        }

    /**
     * Ambil user yang sedang login
     */
    private User getCurrentUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User",
                                "email",
                                email));
    }

    private void validateReservationAccess(Reservation reservation) {

        User currentUser = getCurrentUser();

        // Admin boleh mengakses semua reservation
        if (currentUser.getRole() == UserRole.ADMIN) {
            return;
        }

        // Customer hanya boleh mengakses reservation miliknya
        if (!reservation.getCustomer().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException(
                    "You are not allowed to access this reservation"
            );
        }
    }

    private void validateAdmin() {

        User currentUser = getCurrentUser();

        if (currentUser.getRole() != UserRole.ADMIN) {
            throw new AccessDeniedException(
                    "Only admin can update reservation status"
            );
        }
    }

    private void validateReservationTime(
            LocalTime startTime,
            LocalTime endTime
    ) {

        if (!endTime.isAfter(startTime)) {
            throw new IllegalArgumentException(
                    "End time must be after start time."
            );
        }
    }

    private static final LocalTime OPEN_TIME =
            LocalTime.of(14, 0);

    private static final LocalTime CLOSE_TIME =
            LocalTime.of(22, 0);

    private void validateBusinessHours(
            LocalTime startTime,
            LocalTime endTime
    ) {

        if (startTime.isBefore(OPEN_TIME)
                || endTime.isAfter(CLOSE_TIME)) {

            throw new IllegalArgumentException(
                    "Reservation time is outside business hours."
            );
        }
    }

    private void validateReservationConflict(
            Room room,
            LocalDate reservationDate,
            LocalTime startTime,
            LocalTime endTime
    ) {

        boolean conflict =
                reservationRepository
                        .existsByRoomAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThan(
                                room,
                                reservationDate,
                                endTime,
                                startTime
                        );

        if (conflict) {
            throw new IllegalArgumentException(
                    "Selected time slot is already reserved."
            );
        }
    }

    private void validateReservationConflict(
            Long reservationId,
            Room room,
            LocalDate reservationDate,
            LocalTime startTime,
            LocalTime endTime
    ) {

        boolean conflict =
                reservationRepository
                        .existsByRoomAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
                                room,
                                reservationDate,
                                endTime,
                                startTime,
                                reservationId
                        );

        if (conflict) {
            throw new IllegalArgumentException(
                    "Selected time slot is already reserved."
            );
        }
    }
}