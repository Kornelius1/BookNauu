package com.reservation.reservation.repository;

import com.reservation.auth.entity.User;
import com.reservation.reservation.entity.Reservation;
import com.reservation.reservation.entity.ReservationStatus;
import com.reservation.resource.entity.BookableResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface ReservationRepository
        extends JpaRepository<Reservation, Long> {

    /*
     * Semua reservation milik business.
     */
    List<Reservation> findByBusinessId(
            Long businessId
    );

    /*
     * Reservation tertentu milik business.
     */
    Optional<Reservation> findByIdAndBusinessId(
            Long id,
            Long businessId
    );

    /*
     * Semua reservation customer
     * dalam business tertentu.
     */
    List<Reservation> findByBusinessIdAndCustomer(
            Long businessId,
            User customer
    );

    /*
     * Semua reservation resource
     * dalam business tertentu.
     */
    List<Reservation> findByBusinessIdAndResource(
            Long businessId,
            BookableResource resource
    );

    /*
     * Semua reservation resource
     * pada tanggal tertentu.
     */
    List<Reservation>
    findByBusinessIdAndResourceAndReservationDate(
            Long businessId,
            BookableResource resource,
            LocalDate reservationDate
    );

    /*
     * Semua reservation berdasarkan status
     * dalam business tertentu.
     */
    List<Reservation> findByBusinessIdAndStatus(
            Long businessId,
            ReservationStatus status
    );

    /*
     * Mengecek konflik reservation.
     */
    boolean
    existsByBusinessIdAndResourceAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Long businessId,
            BookableResource resource,
            LocalDate reservationDate,
            LocalTime endTime,
            LocalTime startTime
    );

    /*
     * Mengecek konflik saat UPDATE,
     * tetapi mengabaikan reservation yang sedang di-update.
     */
    boolean
    existsByBusinessIdAndResourceAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThanAndIdNot(
            Long businessId,
            BookableResource resource,
            LocalDate reservationDate,
            LocalTime endTime,
            LocalTime startTime,
            Long id
    );
}