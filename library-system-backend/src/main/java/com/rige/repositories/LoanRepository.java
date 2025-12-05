package com.rige.repositories;

import com.rige.entities.LoanEntity;
import com.rige.enums.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<LoanEntity, Long> {

    List<LoanEntity> findByStatus(LoanStatus status);

    List<LoanEntity> findByUserId(Long userId);

    List<LoanEntity> findByBookIdAndStatus(Long bookId, LoanStatus status);
}