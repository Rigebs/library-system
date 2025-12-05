package com.rige.services;

import com.rige.dto.request.AuthRequest;
import com.rige.dto.request.UserRequest;
import com.rige.dto.response.TokenResponse;
import com.rige.dto.response.UserResponse;

public interface AuthService {

    UserResponse register(UserRequest request);

    TokenResponse login(AuthRequest request);

    TokenResponse refreshToken(String refreshToken);
}