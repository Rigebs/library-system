package com.rige.dto.request;

public record AuthRequest(
    String email,
    String password
) {}