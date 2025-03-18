package com.example.Rentify.service;

import com.example.Rentify.entity.MagicToken;
import com.example.Rentify.entity.User;
import com.example.Rentify.repo.MagicTokenRepo;
import com.example.Rentify.repo.UserRepo;
import com.example.Rentify.service.email.EmailService;
import com.example.Rentify.utils.JWTUtil;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Optional;

@Service
public class MagicLinkServiceImpl implements MagicLinkService {
    private static final String ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private final SecureRandom random = new SecureRandom();

    private final JWTUtil jwtUtil;
    private final MagicTokenRepo magicTokenRepo;
    private final EmailService emailService;
    private final UserRepo userRepo;

    public MagicLinkServiceImpl(MagicTokenRepo magicTokenRepo, EmailService emailService, UserRepo userRepo, JWTUtil jwtUtil) {
        this.magicTokenRepo = magicTokenRepo;
        this.emailService = emailService;
        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void issueMagicLink(String email) {
        userRepo.findFirstByEmail(email).orElseThrow(() ->
                new IllegalArgumentException("User with email " + email + " not found"));

        String token = generateToken(64);
        MagicToken magicToken = new MagicToken();
        magicToken.setEmail(email);
        magicToken.setToken(token);
        magicToken.setCreated(Instant.now());
        magicTokenRepo.save(magicToken);
        // Sende den Magic-Link an den Nutzer
        String link = "http://localhost:8080/api/auth/magic/" + token;
        emailService.sendMagicLink(email, link, "Your magic login link for Rentify 🚀", "Hey! Here's your login link:");
    }

    @Override
    public String generateToken(int size) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < size; i++) {
            int index = random.nextInt(ALPHABET.length());
            sb.append(ALPHABET.charAt(index));
        }
        return sb.toString();
    }



    @Override
    public Optional<String> validateToken(String token) {
        Optional<MagicToken> optionalToken = magicTokenRepo.findByToken(token);
        if (optionalToken.isPresent()) {
            MagicToken magicToken = optionalToken.get();
            Instant threshold = Instant.now().minusSeconds(900);
            if (magicToken.getCreated().isAfter(threshold)) {
                User user = userRepo.findFirstByEmail(magicToken.getEmail())
                        .orElseThrow(() -> new RuntimeException("User not found"));

                String jwt = jwtUtil.generateToken(user);
                magicTokenRepo.delete(magicToken);
                return Optional.of(jwt);
            } else {
                magicTokenRepo.delete(magicToken);
            }
        }
        return Optional.empty();
    }




    @Override
    public Optional<MagicToken> getTokenEntity(String token) {
        return magicTokenRepo.findByToken(token);
    }

    @Override
    public void deleteToken(String token) {
        magicTokenRepo.findByToken(token).ifPresent(magicTokenRepo::delete);
    }

}
