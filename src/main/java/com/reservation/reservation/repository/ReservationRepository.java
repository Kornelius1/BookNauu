package com.reservation.reservation.repository;

import com.reservation.auth.entity.User;
import com.reservation.reservation.entity.Reservation;
import com.reservation.reservation.entity.ReservationStatus;
import com.reservation.room.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    /**
     * Semua reservasi milik customer
     */
    List<Reservation> findByCustomer(User customer);

    /**
     * Semua reservasi untuk suatu room
     */
    List<Reservation> findByRoom(Room room);

    /**
     * Semua reservasi pada tanggal tertentu
     */
    List<Reservation> findByReservationDate(LocalDate reservationDate);

    /**
     * Semua reservasi suatu room pada tanggal tertentu
     */
    List<Reservation> findByRoomAndReservationDate(
            Room room,
            LocalDate reservationDate
    );

    /**
     * Semua reservasi berdasarkan status
     */
    List<Reservation> findByStatus(ReservationStatus status);

    /**
     * Mengecek apakah ada jadwal yang bentrok
     */
    boolean existsByRoomAndReservationDateAndStartTimeLessThanAndEndTimeGreaterThan(
            Room room,
            LocalDate reservationDate,
            LocalTime endTime,
            LocalTime startTime
    );

}