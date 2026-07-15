package org.project.realtimechatapplication.repository;

import org.project.realtimechatapplication.entity.Message;
import org.project.realtimechatapplication.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message,Long> {

    List<Message> findByRoomOrderBySentAtAsc(Room room);

    List<Message> findBySentAtBefore(java.time.LocalDateTime cutoff);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Message m SET m.parent = null WHERE m.parent IN :messages")
    void nullifyParentForMessages(@org.springframework.data.repository.query.Param("messages") List<Message> messages);

}