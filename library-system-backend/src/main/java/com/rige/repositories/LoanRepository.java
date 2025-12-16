package com.rige.repositories;

import com.rige.entities.LoanEntity;
import com.rige.enums.LoanStatus;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {

    List<LoanEntity> findByStatus(LoanStatus status);

    List<LoanEntity> findByUserId(Long userId);

    List<LoanEntity> findByBookIdAndStatus(Long bookId, LoanStatus status);

    long countByUserIdAndStatus(Long userId, LoanStatus status);

    long countByBookIdAndStatus(Long bookId, LoanStatus status);

    long countByStatus(LoanStatus status);

    List<LoanEntity> findByStatusIn(List<LoanStatus> statuses);

    @Override
    @NonNull
    @EntityGraph(attributePaths = {"user", "book"})
    List<LoanEntity> findAll();

    @Override
    @NonNull
    @EntityGraph(attributePaths = {"user", "book"})
    Optional<LoanEntity> findById(@NonNull Long id);

    List<LoanEntity> findByStatusAndExpectedReturnDateBefore(LoanStatus status, LocalDateTime dateTime);
}