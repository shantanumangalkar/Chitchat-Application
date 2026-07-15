package org.project.realtimechatapplication.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.realtimechatapplication.dto.*;
import org.project.realtimechatapplication.services.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(
            @Valid @RequestBody CreateRoomRequest request){

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(roomService.createRoom(request));

    }
    @PostMapping("/join")
    public ResponseEntity<JoinRoomResponse> joinRoom(
            @Valid @RequestBody JoinRoomRequest request) {

        return ResponseEntity.ok(
                roomService.joinRoom(request)
        );
    }
    @GetMapping("/my")
    public ResponseEntity<List<RoomResponse>> getMyRooms() {

        return ResponseEntity.ok(
                roomService.getMyRooms()
        );
    }
    @GetMapping("/{roomCode}")
    public ResponseEntity<RoomDetailsResponse> getRoomDetails(
            @PathVariable String roomCode) {

        return ResponseEntity.ok(
                roomService.getRoomDetails(roomCode)
        );

    }
    @DeleteMapping("/{roomCode}/leave")
    public ResponseEntity<String> leaveRoom(
            @PathVariable String roomCode){

        return ResponseEntity.ok(
                roomService.leaveRoom(roomCode)
        );

    }

    @GetMapping("/{roomCode}/messages")
    public ResponseEntity<List<MessageResponse>> getRoomMessages(
            @PathVariable String roomCode) {

        return ResponseEntity.ok(
                roomService.getRoomMessages(roomCode)
        );
    }

    @PostMapping("/{roomCode}/seen")
    public ResponseEntity<Void> markRoomMessagesAsSeen(
            @PathVariable String roomCode) {

        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        roomService.markMessagesAsSeen(roomCode, email);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{roomCode}")
    public ResponseEntity<String> destroyRoom(
            @PathVariable String roomCode) {

        org.springframework.security.core.Authentication authentication =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        roomService.destroyRoom(roomCode, email);
        return ResponseEntity.ok("Room destroyed successfully.");
    }

}