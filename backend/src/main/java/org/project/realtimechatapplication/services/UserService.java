package org.project.realtimechatapplication.services;

import lombok.RequiredArgsConstructor;
import org.project.realtimechatapplication.dto.LoginRequest;
import org.project.realtimechatapplication.dto.LoginResponse;
import org.project.realtimechatapplication.dto.RegisterRequest;
import org.project.realtimechatapplication.dto.RegisterResponse;
import org.project.realtimechatapplication.entity.User;
import org.project.realtimechatapplication.exception.UserAlreadyExistsException;
import org.project.realtimechatapplication.mapper.UserMapper;
import org.project.realtimechatapplication.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    /**
     * Register User
     */
    public RegisterResponse registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email already exists");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username already exists");
        }

        User user = userMapper.toEntity(request);

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        User savedUser = userRepository.save(user);

        return userMapper.toRegisterResponse(savedUser);
    }

    /**
     * Login User
     */
    public LoginResponse loginUser(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow();

        String jwtToken = jwtService.generateToken(user);

        return LoginResponse.builder()
                .id(user.getId())
                .username(user.getRealUsername())
                .email(user.getEmail())
                .token(jwtToken)
                .message("Login Successful")
                .build();
    }

}
