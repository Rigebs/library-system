package com.rige.services.impl;

import com.rige.dto.response.DashboardSummaryResponse;
import com.rige.enums.LoanStatus;
import com.rige.repositories.BookRepository;
import com.rige.repositories.LoanRepository;
import com.rige.repositories.UserRepository;
import com.rige.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    @Override
    public DashboardSummaryResponse getSummary() {
        long totalBooks = bookRepository.count();
        long totalUsers = userRepository.count();
        long activeLoans = loanRepository.countByStatus(LoanStatus.ACTIVE);
        long overdueLoans = loanRepository.countByStatus(LoanStatus.OVERDUE);

        return new DashboardSummaryResponse(
                totalBooks,
                totalUsers,
                activeLoans,
                overdueLoans
        );
    }
}