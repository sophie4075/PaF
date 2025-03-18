package com.example.Rentify.service.auth.strategy;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface TokenValidationStrategy {
    void validate(String token, HttpServletRequest request, HttpServletResponse response);

}
