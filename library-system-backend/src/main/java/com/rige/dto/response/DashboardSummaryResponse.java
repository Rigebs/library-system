package com.rige.dto.response;

public record DashboardSummaryResponse(
    long totalBooks,
    long totalUsers,
    long activeLoans,
    long overdueLoans
) {}