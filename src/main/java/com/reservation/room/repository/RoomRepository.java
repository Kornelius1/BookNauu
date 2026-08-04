package com.reservation.room.repository;

import com.reservation.room.entity.Room;
import com.reservation.room.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    /**
     * Mencari room berdasarkan nama.
     */
    Optional<Room> findByName(String name);

    /**
     * Mengecek apakah nama room sudah digunakan.
     */
    boolean existsByName(String name);

    /**
     * Mengambil seluruh room berdasarkan status.
     */
    List<Room> findByStatus(RoomStatus status);

}