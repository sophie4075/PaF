package com.example.Rentify.service.auth.strategy;

import com.example.Rentify.dto.AuthRequest;
import com.example.Rentify.service.MagicLinkService;
import org.springframework.stereotype.Service;

@Service
public class MagicLinkAuthenticationStrategy implements AuthenticationStrategy {
    private final MagicLinkService magicLinkService;

    public MagicLinkAuthenticationStrategy(MagicLinkService magicLinkService) {
        this.magicLinkService = magicLinkService;
    }

    @Override
    public void authenticate(AuthRequest request) {
        magicLinkService.issueMagicLink(request.getEmail());
    }
}
