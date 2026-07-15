package org.project.realtimechatapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.project.realtimechatapplication.enums.MessageType;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {

    private String roomCode;

    private String encryptedMessage;

    private String sender;

    private MessageType messageType;

    private Long id;

    private java.time.LocalDateTime sentAt;

    private Long replyToId;

    private String replyToSender;

    private String replyToText;
}