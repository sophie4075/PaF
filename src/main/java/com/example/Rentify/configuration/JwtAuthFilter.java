package com.example.Rentify.configuration;

import com.example.Rentify.service.jwt.UserService;
import com.example.Rentify.utils.JWTUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter to validate JWT tokens for each request.
 * Runs once per request.
 */

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final UserService userService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        //Get auth header
        final String authHeader = request.getHeader("Authorization");
        // Extracted jwt
        final String jwt;
        final String userEmail;

        // Check if the Authorization header is missing or doesn't start with "Bearer "
        //!authHeader.startsWith("Bearer ") ?
        if(StringUtils.isEmpty(authHeader) || !authHeader.startsWith("Bearer ")) {
            // Continue without authentication
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the JWT token from the header
        jwt = authHeader.substring(7);

        // Extract the email from the token
        userEmail = jwtUtil.extractUsername(jwt);

        if(StringUtils.isNotEmpty(userEmail) && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Load user details from the database using the email
            UserDetails userDetails = userService.userDetailsService().loadUserByUsername(userEmail);

            // Check if the JWT is valid for the loaded user
            if(jwtUtil.isTokenValid(jwt, userDetails)) {
                // Create a new authentication token
                SecurityContext context = SecurityContextHolder.createEmptyContext();
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                // Set additional details like the request source
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                // Set the authentication in the SecurityContext
                context.setAuthentication(authentication);
                SecurityContextHolder.setContext(context);
            }
        }

        // Continue with the next filter in the chain
        filterChain.doFilter(request, response);
    }

}
