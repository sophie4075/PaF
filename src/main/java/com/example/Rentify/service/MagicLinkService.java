package com.example.Rentify.service;

import com.example.Rentify.entity.MagicToken;


import java.util.Optional;

public interface MagicLinkService {
    void issueMagicLink(String email);

    String generateToken(int size);

    Optional<String> validateToken(String token);

    Optional<MagicToken> getTokenEntity(String token);
    void deleteToken(String token);
}
