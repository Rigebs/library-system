package com.rige.services.impl;

import com.rige.dto.request.LoanRequest;
import com.rige.dto.response.LoanResponse;
import com.rige.entities.BookEntity;
import com.rige.entities.LoanEntity;
import com.rige.entities.UserEntity;
import com.rige.enums.LoanStatus;
import com.rige.mappers.LoanMapper;
import com.rige.repositories.BookRepository;
import com.rige.repositories.LoanRepository;
import com.rige.repositories.UserRepository;
import com.rige.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final LoanMapper loanMapper;

    @Override
    public List<LoanResponse> findAllLoans() {
        return loanRepository.findAll().stream()
                .map(loanMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public LoanResponse findLoanById(Long id) {
        LoanEntity loan = loanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Loan not found"));
        return loanMapper.toResponse(loan);
    }

    @Override
    @Transactional
    public LoanResponse createLoan(LoanRequest request) {
        UserEntity user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        BookEntity book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        long activeLoans = loanRepository.findByBookIdAndStatus(request.bookId(), LoanStatus.ACTIVE).size();
        if (activeLoans >= book.getTotalQuantity()) {
            throw new RuntimeException("No copies available for loan.");
        }

        LoanEntity newLoan = new LoanEntity();
        newLoan.setUser(user);
        newLoan.setBook(book);
        newLoan.setLoanDate(LocalDateTime.now());
        newLoan.setExpectedReturnDate(LocalDateTime.now().plusDays(request.loanDays()));
        newLoan.setStatus(LoanStatus.ACTIVE);

        LoanEntity savedLoan = loanRepository.save(newLoan);
        return loanMapper.toResponse(savedLoan);
    }

    @Override
    @Transactional
    public LoanResponse returnLoan(Long loanId) {
        LoanEntity loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.ACTIVE && loan.getStatus() != LoanStatus.OVERDUE) {
            throw new RuntimeException("Loan is already returned or invalid status.");
        }

        loan.setActualReturnDate(LocalDateTime.now());
        loan.setStatus(LoanStatus.RETURNED);

        LoanEntity returnedLoan = loanRepository.save(loan);
        return loanMapper.toResponse(returnedLoan);
    }
}