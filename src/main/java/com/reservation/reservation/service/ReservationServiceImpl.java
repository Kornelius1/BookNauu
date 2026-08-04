package com.reservation.reservation.service;

import com.reservation.auth.entity.User;
import com.reservation.auth.repository.UserRepository;
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

import java.math.BigDecimal;
import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationServiceImpl implements ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ReservationMapper reservationMapper;

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

        reservationMapper.updateEntity(request, reservation);


        // update room
        if (request.getRoomId() != null &&
                !request.getRoomId().equals(reservation.getRoom().getId())) {

            Room room = roomRepository.findById(request.getRoomId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Room",
                                    "id",
                                    request.getRoomId()));

            reservation.setRoom(room);
        }


        // Hitung ulang total harga jika jam berubah
        long hours = Duration.between(
                reservation.getStartTime(),
                reservation.getEndTime()
        ).toHours();

        reservation.setTotalPrice(
                reservation.getRoom()
                        .getPrice()
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
}