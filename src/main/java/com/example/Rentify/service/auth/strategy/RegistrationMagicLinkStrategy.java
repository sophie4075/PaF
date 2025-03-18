package com.example.Rentify.service.auth.strategy;

import com.example.Rentify.entity.MagicToken;
import com.example.Rentify.repo.MagicTokenRepo;
import com.example.Rentify.repo.UserRepo;
import com.example.Rentify.service.email.EmailService;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;

@Service
public class RegistrationMagicLinkStrategy implements MagicLinkStrategy {

    private final MagicTokenRepo magicTokenRepo;
    private final UserRepo userRepo;
    private final EmailService emailService;

    public RegistrationMagicLinkStrategy(MagicTokenRepo magicTokenRepo, UserRepo userRepo, EmailService emailService) {
        this.magicTokenRepo = magicTokenRepo;
        this.userRepo = userRepo;
        this.emailService = emailService;
    }

    @Override
    public void sendLink(String email) {
        userRepo.findFirstByEmail(email).orElseThrow(() ->
                new IllegalArgumentException("User with email " + email + " not found"));

        String token = generateToken(64);
        MagicToken magicToken = new MagicToken();
        magicToken.setEmail(email);
        magicToken.setToken(token);
        magicToken.setCreated(Instant.now());
        magicTokenRepo.save(magicToken);

        String link = "http://localhost:8080/api/auth/register/confirm/" + token;
        emailService.sendMagicLink(email, link, "Please confirm your registration ✅", "Hey! Confirm your account here:");
    }

    private String generateToken(int size) {
        String alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < size; i++) {
            int index = random.nextInt(alphabet.length());
            sb.append(alphabet.charAt(index));
        }
        return sb.toString();
    }
}
