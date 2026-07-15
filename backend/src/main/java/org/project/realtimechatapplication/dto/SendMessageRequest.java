package org.project.realtimechatapplication.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendMessageRequest {

    private String roomCode;

    /**
     * Already encrypted by React
     */
    private String encryptedMessage;

}