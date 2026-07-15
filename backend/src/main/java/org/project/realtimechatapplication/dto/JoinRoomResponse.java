package org.project.realtimechatapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinRoomResponse {

    private Long roomId;

    private String roomName;

    private String roomCode;

    private String message;
}