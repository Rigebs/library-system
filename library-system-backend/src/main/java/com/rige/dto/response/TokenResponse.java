package com.rige.dto.response;

public record TokenResponse(
    String accessToken,
    String refreshToken
) {}