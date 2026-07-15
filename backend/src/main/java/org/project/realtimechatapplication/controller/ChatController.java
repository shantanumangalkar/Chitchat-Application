package org.project.realtimechatapplication.controller;

import lombok.RequiredArgsConstructor;
import org.project.realtimechatapplication.dto.ChatMessage;
import org.project.realtimechatapplication.services.MessageService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final MessageService messageService;

    @MessageMapping("/chat.send")
    public void sendMessage(
            ChatMessage chatMessage,
            Principal principal) {

        messageService.sendMessage(chatMessage, principal);

    }

}