package com.example.Rentify.api;

import com.example.Rentify.dto.AuthRequest;
import com.example.Rentify.dto.AuthResponse;
import com.example.Rentify.dto.RegisterRequest;
import com.example.Rentify.dto.UserDto;
import com.example.Rentify.entity.User;
import com.example.Rentify.repo.UserRepo;
import com.example.Rentify.service.auth.AuthService;
import com.example.Rentify.service.jwt.UserService;
import com.example.Rentify.utils.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody RegisterRequest registerRequest) {

        log.info("registerCustomer() - Incoming req: {}", registerRequest);

       if(authService.hasCustomerWithEmail(registerRequest.getEmail())) {
           //406
           return new ResponseEntity<>(
                   "Something went wrong while creating your account, please contact xxx if this error reoccurs",
                   HttpStatus.NOT_ACCEPTABLE
           );
       }

        UserDto createdCustomerDto = authService.createCustomer(registerRequest);


       if(createdCustomerDto == null) {
           //400
           return new ResponseEntity<>(
                   "Request body could not be read properly, please contact xxx if this error reoccurs",
                   HttpStatus.BAD_REQUEST
           );
       }
       return new ResponseEntity<>(createdCustomerDto, HttpStatus.CREATED);
    }

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JWTUtil jwtUtil;

    private final UserRepo userRepo;

    @PostMapping("/login")
    public AuthResponse createAuthenticationToken(@RequestBody AuthRequest authRequest) throws BadCredentialsException, UsernameNotFoundException {
        try{
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));
        } catch (BadCredentialsException e){
            throw new BadCredentialsException("Bad credentials");
        }

        final UserDetails userDetails = userService.userDetailsService().loadUserByUsername(authRequest.getEmail());
        Optional<User> userOptional = userRepo.findFirstByEmail(userDetails.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);
        AuthResponse authResponse = new AuthResponse();
        if(userOptional.isPresent()) {
            authResponse.setToken(jwt);
            authResponse.setUserId(userOptional.get().getId());
            authResponse.setRole(userOptional.get().getRole());
        }
        return authResponse;
    }
}
