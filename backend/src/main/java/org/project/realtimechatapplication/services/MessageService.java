package org.project.realtimechatapplication.services;

import lombok.RequiredArgsConstructor;
import org.project.realtimechatapplication.dto.ChatMessage;
import org.project.realtimechatapplication.entity.Message;
import org.project.realtimechatapplication.entity.Room;
import org.project.realtimechatapplication.entity.RoomMember;
import org.project.realtimechatapplication.entity.User;
import org.project.realtimechatapplication.enums.MessageType;
import org.project.realtimechatapplication.exception.RoomNotFoundException;
import org.project.realtimechatapplication.repository.MessageRepository;
import org.project.realtimechatapplication.repository.RoomMemberRepository;
import org.project.realtimechatapplication.repository.RoomRepository;
import org.project.realtimechatapplication.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.Principal;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendMessage(
            ChatMessage chatMessage,
            Principal principal){

        String email = principal.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        Room room = roomRepository.findByRoomCode(chatMessage.getRoomCode())
                .orElseThrow(() ->
                        new RoomNotFoundException("Room not found"));

        roomMemberRepository.findByRoomAndUser(room,user)
                .orElseThrow(() ->
                        new RuntimeException("You are not a member of this room"));

        Message.MessageBuilder messageBuilder = Message.builder()
                .room(room)
                .sender(user)
                .encryptedMessage(chatMessage.getEncryptedMessage())
                .messageType(chatMessage.getMessageType());

        if (chatMessage.getReplyToId() != null) {
            Message parentMessage = messageRepository.findById(chatMessage.getReplyToId())
                    .orElse(null);
            if (parentMessage != null) {
                messageBuilder.parent(parentMessage);
            }
        }

        Message message = messageBuilder.build();
        messageRepository.save(message);

        chatMessage.setId(message.getId());
        chatMessage.setSender(user.getRealUsername());
        chatMessage.setSentAt(message.getSentAt());

        if (message.getParent() != null) {
            chatMessage.setReplyToId(message.getParent().getId());
            chatMessage.setReplyToSender(message.getParent().getSender().getRealUsername());
            chatMessage.setReplyToText(message.getParent().getEncryptedMessage());
        }

        messagingTemplate.convertAndSend(
                "/topic/room/" + room.getRoomCode(),
                chatMessage
        );

    }

    @org.springframework.scheduling.annotation.Scheduled(cron = "0 0 2 * * ?") // Runs daily at 2:00 AM
    @org.springframework.transaction.annotation.Transactional
    public void deleteOldMessages() {
        java.time.LocalDateTime cutoff = java.time.LocalDateTime.now().minusDays(15);
        java.util.List<Message> oldMessages = messageRepository.findBySentAtBefore(cutoff);
        if (!oldMessages.isEmpty()) {
            messageRepository.nullifyParentForMessages(oldMessages);
            messageRepository.deleteAll(oldMessages);
            System.out.println("Deleted " + oldMessages.size() + " messages older than 15 days.");
        }
    }

}