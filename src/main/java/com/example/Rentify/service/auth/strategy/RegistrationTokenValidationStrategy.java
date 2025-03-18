package com.example.Rentify.service.auth.strategy;

import com.example.Rentify.entity.User;
import com.example.Rentify.repo.MagicTokenRepo;
import com.example.Rentify.repo.UserRepo;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class RegistrationTokenValidationStrategy implements TokenValidationStrategy {

    private final MagicTokenRepo magicTokenRepo;
    private final UserRepo userRepo;

    public RegistrationTokenValidationStrategy(MagicTokenRepo magicTokenRepo, UserRepo userRepo) {
        this.magicTokenRepo = magicTokenRepo;
        this.userRepo = userRepo;
    }

    @Override
    public void validate(String token, HttpServletRequest request, HttpServletResponse response) {
        magicTokenRepo.findByToken(token).ifPresentOrElse(magicToken -> {
            Instant threshold = Instant.now().minusSeconds(900);
            if (magicToken.getCreated().isAfter(threshold)) {
                User user = userRepo.findFirstByEmail(magicToken.getEmail())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                user.setEnabled(true);
                userRepo.save(user);

                magicTokenRepo.delete(magicToken);

                try {
                    response.sendRedirect("http://localhost:4200/login");
                } catch (Exception e) {
                    throw new RuntimeException("Redirect failed.", e);
                }

            } else {
                magicTokenRepo.delete(magicToken);
                throw new RuntimeException("Token expired.");
            }
        }, () -> {
            throw new RuntimeException("Invalid token.");
        });
    }



}
