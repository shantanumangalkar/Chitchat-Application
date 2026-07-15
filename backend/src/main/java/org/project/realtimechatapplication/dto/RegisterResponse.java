package org.project.realtimechatapplication.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class RegisterResponse {
    private Long id;
    private String username;
    private String email;
    private String message;
}
