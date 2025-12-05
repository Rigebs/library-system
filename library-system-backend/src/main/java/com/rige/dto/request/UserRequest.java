package com.rige.dto.request;

import com.rige.enums.Role;

public record UserRequest(
    String name,
    String email,
    String password,
    Role role
) {}