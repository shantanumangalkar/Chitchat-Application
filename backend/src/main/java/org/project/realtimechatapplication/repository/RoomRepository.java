
package org.project.realtimechatapplication.repository;

import org.project.realtimechatapplication.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoomRepository extends JpaRepository<Room, Long> {

    boolean existsByRoomCode(String roomCode);

    Optional<Room> findByRoomCode(String roomCode);

    void delete(Room room);
}