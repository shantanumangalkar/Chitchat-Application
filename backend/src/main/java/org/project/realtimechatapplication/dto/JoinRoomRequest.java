package org.project.realtimechatapplication.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JoinRoomRequest {

    @NotBlank(message = "Room code is required")
    private String roomCode;
}