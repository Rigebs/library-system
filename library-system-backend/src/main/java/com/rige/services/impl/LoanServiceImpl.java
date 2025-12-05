package com.rige.services.impl;

import com.rige.entities.BookEntity;
import com.rige.entities.LoanEntity;
import com.rige.entities.UserEntity;
import com.rige.enums.LoanStatus;
import com.rige.repositories.BookRepository;
import com.rige.repositories.LoanRepository;
import com.rige.repositories.UserRepository;
import com.rige.services.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LoanServiceImpl implements LoanService {

    private final LoanRepository loanRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Override
    public List<LoanEntity> findAllLoans() {
        return loanRepository.findAll();
    }

    @Override
    public Optional<LoanEntity> findLoanById(Long id) {
        return loanRepository.findById(id);
    }

    @Override
    @Transactional
    public LoanEntity createLoan(Long userId, Long bookId, int loanDays) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found")); 

        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found")); 

        long activeLoans = loanRepository.findByBookIdAndStatus(bookId, LoanStatus.ACTIVE).size();

        if (activeLoans >= book.getTotalQuantity()) {
            throw new RuntimeException("No copies available for loan.");
        }

        LoanEntity newLoan = new LoanEntity();
        newLoan.setUser(user);
        newLoan.setBook(book);
        newLoan.setLoanDate(LocalDateTime.now());
        newLoan.setExpectedReturnDate(LocalDateTime.now().plusDays(loanDays));
        newLoan.setStatus(LoanStatus.ACTIVE);

        return loanRepository.save(newLoan);
    }

    @Override
    @Transactional
    public LoanEntity returnLoan(Long loanId) {
        LoanEntity loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() != LoanStatus.ACTIVE && loan.getStatus() != LoanStatus.OVERDUE) {
            throw new RuntimeException("Loan is already returned or invalid status.");
        }

        loan.setActualReturnDate(LocalDateTime.now());
        loan.setStatus(LoanStatus.RETURNED);

        return loanRepository.save(loan);
    }
}