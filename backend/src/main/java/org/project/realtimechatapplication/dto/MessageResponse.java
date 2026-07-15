package org.project.realtimechatapplication.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class MessageResponse {

    private Long id;

    private String sender;

    private String encryptedMessage;

    private LocalDateTime sentAt;

    private Long replyToId;

    private String replyToSender;

    private String replyToText;

    private java.util.List<String> seenBy;

}