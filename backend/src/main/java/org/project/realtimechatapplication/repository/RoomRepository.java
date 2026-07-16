
package org.project.realtimechatapplication.repository;

import org.project.realtimechatapplication.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    boolean existsByRoomCode(String roomCode);

    Optional<Room> findByRoomCode(String roomCode);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Room r " +
            "JOIN FETCH r.createdBy " +
            "WHERE r.roomCode = :roomCode")
    Optional<Room> findByRoomCodeWithCreatedBy(@org.springframework.data.repository.query.Param("roomCode") String roomCode);

    void delete(Room room);
}