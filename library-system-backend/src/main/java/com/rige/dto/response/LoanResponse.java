package com.rige.dto.response;

import com.rige.enums.LoanStatus;

import java.time.LocalDateTime;

public record LoanResponse(
    Long id,
    UserResponse user, 
    BookResponse book,
    LocalDateTime loanDate,
    LocalDateTime expectedReturnDate,
    LocalDateTime actualReturnDate,
    LoanStatus status
) {}