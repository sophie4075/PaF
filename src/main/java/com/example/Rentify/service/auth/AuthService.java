package com.example.Rentify.service.auth;

import com.example.Rentify.dto.RegisterRequest;
import com.example.Rentify.dto.UserDto;

public interface AuthService {
    UserDto createCustomer(RegisterRequest registerRequest);

    boolean hasCustomerWithEmail(String email);
}
