package com.example.Rentify.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JWTUtil {

    // Quellen: https://github.com/jwtk/jjwt#jws-create-key
    // https://www.youtube.com/watch?v=rWgIZwvW0AM

    // Extracts subject from Username
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Creates new Token with default claims
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    //Validates if user token is still valid
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // Extract any claim
    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Creates new token with additional claims
    private String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder()
                .claims(extraClaims)
                .subject(userDetails.getUsername())
                .issuedAt(new Date(System.currentTimeMillis()))
                // 7 Days
                .expiration(new Date(System.currentTimeMillis() + 604800000))
                .signWith(getSignInKey())
                .compact();
    }

    // Token expired?
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Read expiration Date from Token Liest
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Extrahiert alle Claims aus dem Token mit neuem Parser-Ansatz
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    // Generate Key
    //TODO: Reminder: that should probably removed here :D
    private SecretKey getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode("VomOiT8pL65YE3GFEHLwZG2klJ+cmZ7ZHjEkKwxYBoM=");
        return Keys.hmacShaKeyFor(keyBytes);
    }
}

