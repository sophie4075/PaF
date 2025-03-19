package com.example.Rentify.service.auth.facade;

import com.example.Rentify.dto.AuthRequest;
import com.example.Rentify.entity.MagicToken;
import com.example.Rentify.service.MagicLinkService;
import com.example.Rentify.service.auth.strategy.AuthenticationStrategy;
import com.example.Rentify.service.jwt.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolderStrategy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationFacade {
    private final AuthenticationStrategy authenticationStrategy;
    private final MagicLinkService magicLinkService;

    private final UserService userService;

    private final HttpSessionSecurityContextRepository contextRepository;
    private final SecurityContextHolderStrategy contextHolderStrategy;

    public AuthenticationFacade(AuthenticationStrategy authenticationStrategy,
                                MagicLinkService magicLinkService,
                                UserService userService) {
        this.authenticationStrategy = authenticationStrategy;
        this.magicLinkService = magicLinkService;
        this.userService = userService;
        this.contextRepository = new HttpSessionSecurityContextRepository();
        this.contextHolderStrategy = SecurityContextHolder.getContextHolderStrategy();
    }


    public void login(AuthRequest request) {
        authenticationStrategy.authenticate(request);
    }


    public Optional<String> authenticateToken(String token, HttpServletRequest request, HttpServletResponse response) {
        Optional<MagicToken> tokenOpt = magicLinkService.getTokenEntity(token);
        if (tokenOpt.isPresent()) {
            MagicToken magicToken = tokenOpt.get();
            UserDetails user = userService.userDetailsService().loadUserByUsername(magicToken.getEmail());

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    user, null, user.getAuthorities());

            SecurityContext context = contextHolderStrategy.createEmptyContext();
            context.setAuthentication(authToken);
            contextHolderStrategy.setContext(context);
            contextRepository.saveContext(context, request, response);

            return magicLinkService.validateToken(token);
        }
        return Optional.empty();
    }

}
