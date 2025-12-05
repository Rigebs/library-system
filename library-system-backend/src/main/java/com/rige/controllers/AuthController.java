package com.rige.controllers;

import com.rige.dto.request.AuthRequest;
import com.rige.dto.request.RefreshTokenRequest;
import com.rige.dto.request.UserRequest;
import com.rige.dto.response.ApiResponse;
import com.rige.dto.response.TokenResponse;
import com.rige.dto.response.UserResponse;
import com.rige.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> registerUser(@RequestBody UserRequest request) {
        try {
            UserResponse response = authService.register(request);
            return new ResponseEntity<>(
                ApiResponse.success(response, "Registration successful"),
                HttpStatus.CREATED
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                ApiResponse.error(e.getMessage()),
                HttpStatus.BAD_REQUEST
            );
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> loginUser(@RequestBody AuthRequest request) {
        try {
            TokenResponse response = authService.login(request);
            return ResponseEntity.ok(
                ApiResponse.success(response, "Login successful")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                ApiResponse.error(e.getMessage()),
                HttpStatus.UNAUTHORIZED
            );
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<TokenResponse>> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            TokenResponse response = authService.refreshToken(request.refreshToken());

            return ResponseEntity.ok(
                    ApiResponse.success(response, "Token refreshed successfully")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error(e.getMessage()),
                    HttpStatus.UNAUTHORIZED
            );
        }
    }
}