package com.rige.dto.request;

public record LoanRequest(
    Long userId,
    Long bookId
) {}