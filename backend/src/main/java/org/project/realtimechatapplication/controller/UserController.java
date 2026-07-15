package org.project.realtimechatapplication.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.project.realtimechatapplication.dto.LoginRequest;
import org.project.realtimechatapplication.dto.LoginResponse;
import org.project.realtimechatapplication.dto.RegisterRequest;
import org.project.realtimechatapplication.dto.RegisterResponse;
import org.project.realtimechatapplication.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    @GetMapping("/test")
    public String test() {
        return "JWT is working";
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(
            @Valid @RequestBody RegisterRequest request) {

        RegisterResponse response = userService.registerUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response = userService.loginUser(request);

        return ResponseEntity.ok(response);
    }
}
