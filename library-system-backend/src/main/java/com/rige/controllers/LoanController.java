package com.rige.controllers;

import com.rige.dto.request.LoanRequest;
import com.rige.dto.response.ApiResponse;
import com.rige.dto.response.LoanResponse;
import com.rige.enums.LoanStatus;
import com.rige.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LoanResponse>>> getAllLoans(
            @RequestParam(required = false) List<LoanStatus> status) {

        List<LoanResponse> loans;

        if (status != null && !status.isEmpty()) {
            loans = loanService.findLoansByStatusIn(status);
            return ResponseEntity.ok(
                    ApiResponse.success(loans, "Loan list filtered by status retrieved successfully")
            );
        } else {
            loans = loanService.findAllLoans();
            return ResponseEntity.ok(
                    ApiResponse.success(loans, "Complete loan history retrieved successfully")
            );
        }
    }

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<LoanResponse>> createLoan(@RequestBody LoanRequest request) {
        try {
            LoanResponse newLoan = loanService.createLoan(request);
            return new ResponseEntity<>(
                    ApiResponse.success(newLoan, "Loan created successfully"),
                    HttpStatus.CREATED
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error("Failed to create loan: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<LoanResponse>> getLoanById(@PathVariable Long id) {
        try {
            LoanResponse loan = loanService.findLoanById(id);
            return ResponseEntity.ok(
                    ApiResponse.success(loan, "Loan retrieved successfully")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error("Failed to retrieve loan: " + e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<ApiResponse<LoanResponse>> returnLoan(@PathVariable Long id) {
        try {
            LoanResponse returnedLoan = loanService.returnLoan(id);
            return ResponseEntity.ok(
                    ApiResponse.success(returnedLoan, "Loan returned successfully")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error("Failed to return loan: " + e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }
}