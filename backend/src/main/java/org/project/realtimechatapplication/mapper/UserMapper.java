package org.project.realtimechatapplication.mapper;

import org.project.realtimechatapplication.dto.LoginResponse;
import org.project.realtimechatapplication.dto.RegisterRequest;
import org.project.realtimechatapplication.dto.RegisterResponse;
import org.project.realtimechatapplication.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequest request) {

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        return user;
    }

    public RegisterResponse toRegisterResponse(User user) {

        return new RegisterResponse(
                user.getId(),
                user.getRealUsername(),
                user.getEmail(),
                "User registered successfully"
        );
    }

}
