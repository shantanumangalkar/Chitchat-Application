package org.project.realtimechatapplication.mapper;

import org.project.realtimechatapplication.dto.CreateRoomResponse;
import org.project.realtimechatapplication.entity.Room;
import org.springframework.stereotype.Component;

@Component
public class RoomMapper {

    public CreateRoomResponse toResponse(Room room) {

        return CreateRoomResponse.builder()
                .id(room.getId())
                .roomName(room.getRoomName())
                .roomCode(room.getRoomCode())
                .owner(room.getCreatedBy().getRealUsername())
                .message("Room Created Successfully")
                .build();
    }
}