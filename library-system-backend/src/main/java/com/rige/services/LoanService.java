package com.rige.services;

import com.rige.dto.request.LoanRequest;
import com.rige.dto.response.LoanResponse;

import java.util.List;

public interface LoanService {
    List<LoanResponse> findAllLoans();
    LoanResponse findLoanById(Long id);
    LoanResponse createLoan(LoanRequest request);
    LoanResponse returnLoan(Long loanId);
}