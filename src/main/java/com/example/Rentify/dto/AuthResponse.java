package com.example.Rentify.dto;

import com.example.Rentify.entity.Role;
import lombok.Data;

@Data

public class AuthResponse {
    private String token;
    private Role role;
    private Long userId;
}
