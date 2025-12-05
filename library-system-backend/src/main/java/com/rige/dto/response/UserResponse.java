package com.rige.dto.response;

import com.rige.enums.Role;

import java.time.LocalDateTime;

public record UserResponse(
    Long id,
    String name,
    String email,
    Role role,
    LocalDateTime registrationDate
) {}