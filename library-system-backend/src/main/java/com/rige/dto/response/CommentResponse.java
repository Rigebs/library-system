package com.rige.dto.response;

import com.rige.enums.CommentStatus;

import java.time.LocalDateTime;

public record CommentResponse(
    Long id,
    String text,
    CommentStatus status,
    LocalDateTime createdAt,
    BookResponse book,
    UserResponse user
) {}