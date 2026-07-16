package org.project.realtimechatapplication.repository;


import org.project.realtimechatapplication.entity.Room;
import org.project.realtimechatapplication.entity.RoomMember;
import org.project.realtimechatapplication.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RoomMemberRepository extends JpaRepository<RoomMember, Long> {
    boolean existsByRoomAndUser(Room room, User user);

    List<RoomMember> findByRoom(Room room);

    List<RoomMember> findByUser(User user);

    List<RoomMember> findAllByUser(User user);

    @org.springframework.data.jpa.repository.Query("SELECT rm FROM RoomMember rm " +
            "JOIN FETCH rm.room r " +
            "JOIN FETCH r.createdBy " +
            "WHERE rm.user = :user")
    List<RoomMember> findAllByUserWithRoomAndOwner(@org.springframework.data.repository.query.Param("user") User user);

    Optional<RoomMember> findByRoomAndUser(Room room, User user);

    long countByRoom(Room room);

    void delete(RoomMember roomMember);

    void deleteByRoom(Room room);

}