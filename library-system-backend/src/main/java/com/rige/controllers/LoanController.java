package com.rige.controllers;

import com.rige.entities.LoanEntity;
import com.rige.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @GetMapping
    public List<LoanEntity> getAllLoans() {
        return loanService.findAllLoans();
    }

    @PostMapping("/create")
    public ResponseEntity<?> createLoan(@RequestBody Map<String, Long> requestBody) {

        Long userId = requestBody.get("userId");
        Long bookId = requestBody.get("bookId");
        int loanDays = 7;

        try {
            LoanEntity newLoan = loanService.createLoan(userId, bookId, loanDays);
            return new ResponseEntity<>(newLoan, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<?> returnLoan(@PathVariable Long id) {
        try {
            LoanEntity returnedLoan = loanService.returnLoan(id);
            return ResponseEntity.ok(returnedLoan);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}