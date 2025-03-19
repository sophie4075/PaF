package com.example.Rentify.api;

import com.example.Rentify.dto.AuthRequest;
import com.example.Rentify.dto.AuthResponse;
import com.example.Rentify.dto.RegisterRequest;
import com.example.Rentify.dto.UserDto;
import com.example.Rentify.entity.User;
import com.example.Rentify.repo.UserRepo;
import com.example.Rentify.service.auth.AuthService;
import com.example.Rentify.service.auth.facade.AuthenticationFacade;
import com.example.Rentify.service.auth.strategy.TokenValidationStrategy;
import com.example.Rentify.service.jwt.UserService;
import com.example.Rentify.utils.JWTUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.antlr.v4.runtime.Token;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@Slf4j
public class AuthController {

    private final AuthenticationFacade authenticationFacade;
    private final AuthService authService;
    private final TokenValidationStrategy tokenValidationStrategy;

    public AuthController(AuthenticationFacade authenticationFacade, AuthService authService, TokenValidationStrategy tokenValidationStrategy) {
        this.authenticationFacade = authenticationFacade;
        this.authService = authService;
        this.tokenValidationStrategy = tokenValidationStrategy;
    }

    /**
     * Startet den Magic-Link-Login-Prozess.
     */
    @PostMapping("/magic")
    public ResponseEntity<Map<String, String>> sendMagicLink(@RequestBody AuthRequest request) {
        try {
            authenticationFacade.login(request);
            return ResponseEntity.ok(Map.of("message", "Magic link sent to " + request.getEmail()));
        } catch (Exception e) {
            log.error("Error while sending magic link: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to send magic link."));
        }
    }


    /**
     * Verarbeitet den Klick auf den Magic-Link.
     * Leitet nach erfolgreicher Auth auf Frontend weiter.
     */
    @GetMapping("/magic/{token}")
    public void authenticateMagicLink(@PathVariable String token,
                                      HttpServletRequest request,
                                      HttpServletResponse response) {
        try {
            Optional<String> jwtOpt = authenticationFacade.authenticateToken(token, request, response);
            if (jwtOpt.isPresent()) {
                String jwt = jwtOpt.get();
                response.sendRedirect("http://localhost:4200/magic-login?token=" + jwt);
            } else {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid or expired token.");
            }
        } catch (IOException e) {
            log.error("Redirect failed: {}", e.getMessage(), e);
            try {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Redirect failed.");
            } catch (IOException ex) {
                log.error("Error sending error response: {}", ex.getMessage(), ex);
            }
        }
    }

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

    @GetMapping("/register/confirm/{token}")
    public void confirmRegistration(@PathVariable String token,
                                    HttpServletRequest request,
                                    HttpServletResponse response) {
        tokenValidationStrategy.validate(token, request, response);
    }



}
    /*private final AuthService authService;

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
    }*/


