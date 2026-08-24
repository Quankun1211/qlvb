package com.qlvb.mofa.config;

import com.qlvb.mofa.entity.User;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.crypto.SecretKey;

@Component
public class JwtTokenUtil {

    private final SecretKey key;
    private final long accessTokenExpirationMs;
    private final long refreshTokenExpirationMs;

    private final Integer DEFAULT_ACCESS_TOKEN_EXPIRATION_MS = 3600;
    private final Integer DEFAULT_REFRESH_TOKEN_EXPIRATION_MS = 3600;

    public JwtTokenUtil(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.access-token-expiration-ms:604800000}") long accessTokenExpirationMs,
            @Value("${app.jwt.refresh-token-expiration-ms:604800000}") long refreshTokenExpirationMs
    ) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret key phải dài tối thiểu 32 ký tự!");
        }

        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.accessTokenExpirationMs = (accessTokenExpirationMs > 0)
                ? accessTokenExpirationMs
                : DEFAULT_ACCESS_TOKEN_EXPIRATION_MS;
        this.refreshTokenExpirationMs = (refreshTokenExpirationMs > 0)
                ? refreshTokenExpirationMs
                : DEFAULT_REFRESH_TOKEN_EXPIRATION_MS;
    }

    public String generateAccessToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + accessTokenExpirationMs);

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("scope", buildScope(user))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }
    private String buildScope(User user) {
        if (user.getRole() == null) {
            return "";
        }

        return "ROLE_" + user.getRole().name();
    }

    public String generateToken(User user) {
        return generateAccessToken(user);
    }

    public String generateRefreshToken(User user) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationMs);

        return Jwts.builder()
                .setSubject(user.getUsername())
                .claim("scope", buildScope(user))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getSubjectFromToken(token);
    }

    public String getSubjectFromToken(String token) {
        Claims claims = parseToken(token);
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            parseToken(token);
            return true;
        } catch (MalformedJwtException ex) {
            System.err.println(" Token không hợp lệ: " + ex.getMessage());
        } catch (ExpiredJwtException ex) {
            System.err.println(" Token đã hết hạn: " + ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            System.err.println(" Token không được hỗ trợ: " + ex.getMessage());
        } catch (IllegalArgumentException ex) {
            System.err.println(" Token rỗng hoặc không đúng định dạng: " + ex.getMessage());
        } catch (JwtException ex) {
            System.err.println(" Lỗi JWT khác: " + ex.getMessage());
        }
        return false;
    }


    public Date getExpirationDateFromToken(String token) {
        return parseToken(token).getExpiration();
    }

    public boolean isTokenExpired(String token) {
        return getExpirationDateFromToken(token).before(new Date());
    }

    private Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
