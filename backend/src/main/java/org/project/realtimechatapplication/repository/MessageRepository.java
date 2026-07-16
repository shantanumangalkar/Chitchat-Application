package org.project.realtimechatapplication.repository;

import org.project.realtimechatapplication.entity.Message;
import org.project.realtimechatapplication.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

import org.project.realtimechatapplication.entity.User;

public interface MessageRepository extends JpaRepository<Message,Long> {

    List<Message> findByRoomOrderBySentAtAsc(Room room);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT m FROM Message m " +
            "LEFT JOIN FETCH m.sender " +
            "LEFT JOIN FETCH m.parent " +
            "LEFT JOIN FETCH m.parent.sender " +
            "WHERE m.room = :room " +
            "ORDER BY m.sentAt ASC")
    List<Message> findByRoomWithSenderAndParentOrderBySentAtAsc(@org.springframework.data.repository.query.Param("room") Room room);

    @org.springframework.data.jpa.repository.Query("SELECT m FROM Message m " +
            "WHERE m.room = :room " +
            "AND m.sender <> :user " +
            "AND :user NOT MEMBER OF m.seenBy")
    List<Message> findUnseenMessages(
            @org.springframework.data.repository.query.Param("room") Room room,
            @org.springframework.data.repository.query.Param("user") User user);

    List<Message> findBySentAtBefore(java.time.LocalDateTime cutoff);

    @org.springframework.data.jpa.repository.Modifying
    @org.springframework.data.jpa.repository.Query("UPDATE Message m SET m.parent = null WHERE m.parent IN :messages")
    void nullifyParentForMessages(@org.springframework.data.repository.query.Param("messages") List<Message> messages);

}