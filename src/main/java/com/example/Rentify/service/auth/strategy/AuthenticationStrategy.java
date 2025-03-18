package com.example.Rentify.service.auth.strategy;

import com.example.Rentify.dto.AuthRequest;

public interface AuthenticationStrategy {
    void authenticate(AuthRequest request);
}
