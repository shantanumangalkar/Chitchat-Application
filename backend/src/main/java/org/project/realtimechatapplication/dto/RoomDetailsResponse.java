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
public class RoomDetailsResponse {

    private Long id;

    private String roomName;

    private String roomCode;

    private String owner;

    private String ownerEmail;

    private Integer memberCount;

}