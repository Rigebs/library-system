package com.rige.services;

import com.rige.dto.request.LoanRequest;
import com.rige.dto.response.LoanResponse;
import com.rige.enums.LoanStatus;

import java.util.List;

public interface LoanService {
    List<LoanResponse> findAllLoans();

    List<LoanResponse> findLoansByStatusIn(List<LoanStatus> statuses);
    LoanResponse findLoanById(Long id);
    LoanResponse createLoan(LoanRequest request);
    LoanResponse returnLoan(Long loanId);
}