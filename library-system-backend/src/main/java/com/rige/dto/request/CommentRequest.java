package com.rige.dto.request;

public record CommentRequest(
    String text,
    Long bookId,
    Long userId
) {}