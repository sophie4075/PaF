package com.example.Rentify.api;

import com.example.Rentify.dto.RegisterRequest;
import com.example.Rentify.dto.UserDto;
import com.example.Rentify.service.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterRequest registerRequest) {
       UserDto createdCustomerDto = authService.createCustomer(registerRequest);

       if(authService.hasCustomerWithEmail(registerRequest.getEmail())) {
           //406
           return new ResponseEntity<>(
                   "Something went wrong while creating your account, please contact xxx if this error reoccurs", HttpStatus.NOT_ACCEPTABLE
           );
       }

       if(createdCustomerDto == null) {
           //400
           return new ResponseEntity<>(
                   "Request body could not be read properly, please contact xxx if this error reoccurs", HttpStatus.BAD_REQUEST
           );
       }
       return new ResponseEntity<>(createdCustomerDto, HttpStatus.CREATED);
    }
}
