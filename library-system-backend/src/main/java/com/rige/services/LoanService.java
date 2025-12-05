package com.rige.services;

import com.rige.entities.LoanEntity;

import java.util.List;
import java.util.Optional;

public interface LoanService {

    List<LoanEntity> findAllLoans();

    Optional<LoanEntity> findLoanById(Long id);

    LoanEntity createLoan(Long userId, Long bookId, int loanDays);

    LoanEntity returnLoan(Long loanId);
}