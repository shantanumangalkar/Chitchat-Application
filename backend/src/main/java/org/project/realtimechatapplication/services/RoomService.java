package org.project.realtimechatapplication.services;

import lombok.RequiredArgsConstructor;
import org.project.realtimechatapplication.dto.*;
import org.project.realtimechatapplication.entity.Message;
import org.project.realtimechatapplication.entity.Room;
import org.project.realtimechatapplication.entity.RoomMember;
import org.project.realtimechatapplication.entity.User;
import org.project.realtimechatapplication.repository.MessageRepository;
import org.project.realtimechatapplication.exception.AccessDeniedException;
import org.project.realtimechatapplication.exception.AlreadyRoomMemberException;
import org.project.realtimechatapplication.exception.RoomNotFoundException;
import org.project.realtimechatapplication.mapper.RoomMapper;
import org.project.realtimechatapplication.repository.RoomMemberRepository;
import org.project.realtimechatapplication.repository.RoomRepository;
import org.project.realtimechatapplication.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final RoomMapper roomMapper;
    private final MessageRepository messageRepository;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    private static final String CHARACTERS =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    private static final int ROOM_CODE_LENGTH = 8;

    private static final SecureRandom RANDOM =
            new SecureRandom();

    public CreateRoomResponse createRoom(CreateRoomRequest request) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = new Room();

        room.setRoomName(request.getRoomName());

        room.setRoomCode(generateUniqueRoomCode());

        room.setCreatedBy(user);

        Room savedRoom = roomRepository.save(room);

// Creator automatically joins the room
        RoomMember roomMember = new RoomMember();

        roomMember.setRoom(savedRoom);

        roomMember.setUser(user);

        roomMemberRepository.save(roomMember);

        return roomMapper.toResponse(savedRoom);
    }

    private String generateUniqueRoomCode() {

        String roomCode;

        do {

            roomCode = generateRoomCode();

        } while (roomRepository.existsByRoomCode(roomCode));

        return roomCode;
    }

    private String generateRoomCode() {

        StringBuilder builder = new StringBuilder();

        for (int i = 0; i < ROOM_CODE_LENGTH; i++) {

            builder.append(
                    CHARACTERS.charAt(
                            RANDOM.nextInt(CHARACTERS.length())
                    )
            );
        }

        return builder.toString();
    }
    public JoinRoomResponse joinRoom(JoinRoomRequest request) {

        // Get Logged In User
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find Room
        Room room = roomRepository.findByRoomCode(request.getRoomCode())
                .orElseThrow(() ->
                        new RoomNotFoundException("Room not found"));

        // Check if already joined
        if (roomMemberRepository.existsByRoomAndUser(room, user)) {
            throw new AlreadyRoomMemberException(
                    "You are already a member of this room."
            );        }

        // Add User to Room
        RoomMember roomMember = new RoomMember();

        roomMember.setRoom(room);
        roomMember.setUser(user);

        roomMemberRepository.save(roomMember);

        // Response
        return JoinRoomResponse.builder()
                .roomId(room.getId())
                .roomName(room.getRoomName())
                .roomCode(room.getRoomCode())
                .message("Joined Successfully")
                .build();
    }
    public List<RoomResponse> getMyRooms() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<RoomMember> roomMembers =
                roomMemberRepository.findAllByUserWithRoomAndOwner(user);

        return roomMembers.stream()
                .map(roomMember -> {

                    Room room = roomMember.getRoom();

                    return RoomResponse.builder()
                            .id(room.getId())
                            .roomName(room.getRoomName())
                            .roomCode(room.getRoomCode())
                            .owner(room.getCreatedBy().getRealUsername())
                            .ownerEmail(room.getCreatedBy().getEmail())
                            .build();

                })
                .toList();
    }
    public RoomDetailsResponse getRoomDetails(String roomCode) {

        // Get logged-in user
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find room
        Room room = roomRepository.findByRoomCodeWithCreatedBy(roomCode)
                .orElseThrow(() ->
                        new RoomNotFoundException("Room not found"));

        // Check if user is a member of the room
        if (!roomMemberRepository.existsByRoomAndUser(room, user)) {
            throw new AccessDeniedException("You are not a member of this room.");
        }

        // Count members
        long memberCount = roomMemberRepository.countByRoom(room);

        return RoomDetailsResponse.builder()
                .id(room.getId())
                .roomName(room.getRoomName())
                .roomCode(room.getRoomCode())
                .owner(room.getCreatedBy().getRealUsername())
                .ownerEmail(room.getCreatedBy().getEmail())
                .memberCount((int) memberCount)
                .build();
    }

    public String leaveRoom(String roomCode) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findByRoomCodeWithCreatedBy(roomCode)
                .orElseThrow(() ->
                        new RoomNotFoundException("Room not found"));

        RoomMember roomMember = roomMemberRepository
                .findByRoomAndUser(room, user)
                .orElseThrow(() ->
                        new RuntimeException("You are not a member of this room"));

        roomMemberRepository.delete(roomMember);

        List<RoomMember> remainingMembers =
                roomMemberRepository.findByRoom(room);

        if (remainingMembers.isEmpty()) {

            roomRepository.delete(room);

            return "Room deleted because no members are left.";
        }

        if (room.getCreatedBy().getId().equals(user.getId())) {

            room.setCreatedBy(
                    remainingMembers.get(0).getUser()
            );

            roomRepository.save(room);
        }
        System.out.println("Inside leaveRoom()");
        return "Left room successfully.";
    }

    public List<MessageResponse> getRoomMessages(String roomCode) {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() ->
                        new RoomNotFoundException("Room not found"));

        if (!roomMemberRepository.existsByRoomAndUser(room, user)) {
            throw new AccessDeniedException("You are not a member of this room.");
        }

        // Auto mark as seen!
        try {
            markMessagesAsSeen(roomCode, email);
        } catch (Exception e) {
            System.err.println("Failed to auto mark messages as seen: " + e.getMessage());
        }

        List<Message> messages = messageRepository.findByRoomWithSenderAndParentOrderBySentAtAsc(room);

        return messages.stream()
                .map(msg -> {
                    MessageResponse.MessageResponseBuilder builder = MessageResponse.builder()
                            .id(msg.getId())
                            .sender(msg.getSender().getRealUsername())
                            .encryptedMessage(msg.getEncryptedMessage())
                            .sentAt(msg.getSentAt())
                            .seenBy(msg.getSeenBy().stream().map(User::getRealUsername).toList());

                    if (msg.getParent() != null) {
                        builder.replyToId(msg.getParent().getId())
                               .replyToSender(msg.getParent().getSender().getRealUsername())
                               .replyToText(msg.getParent().getEncryptedMessage());
                    }

                    return builder.build();
                })
                .toList();
    }

    @org.springframework.transaction.annotation.Transactional
    public void markMessagesAsSeen(String roomCode, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Room room = roomRepository.findByRoomCode(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        if (!roomMemberRepository.existsByRoomAndUser(room, user)) {
            throw new AccessDeniedException("You are not a member of this room.");
        }

        List<Message> unseenMessages = messageRepository.findUnseenMessages(room, user);
        boolean updated = false;

        for (Message msg : unseenMessages) {
            msg.getSeenBy().add(user);
            messageRepository.save(msg);
            updated = true;
        }

        if (updated) {
            // Broadcast seen update via websocket so other clients update their state in real-time!
            org.project.realtimechatapplication.dto.ChatMessage seenMessage = org.project.realtimechatapplication.dto.ChatMessage.builder()
                    .roomCode(roomCode)
                    .sender(user.getRealUsername())
                    .messageType(org.project.realtimechatapplication.enums.MessageType.SEEN)
                    .encryptedMessage("")
                    .build();

            messagingTemplate.convertAndSend(
                    "/topic/room/" + roomCode,
                    seenMessage
            );
        }
    }

    @org.springframework.transaction.annotation.Transactional
    public void destroyRoom(String roomCode, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Room room = roomRepository.findByRoomCodeWithCreatedBy(roomCode)
                .orElseThrow(() -> new RoomNotFoundException("Room not found"));

        if (!room.getCreatedBy().getId().equals(user.getId())) {
            throw new AccessDeniedException("Only the owner can destroy this room.");
        }

        List<Message> messages = messageRepository.findByRoomOrderBySentAtAsc(room);
        if (!messages.isEmpty()) {
            messageRepository.nullifyParentForMessages(messages);
            messageRepository.deleteAll(messages);
        }

        roomMemberRepository.deleteByRoom(room);
        roomRepository.delete(room);
    }
}