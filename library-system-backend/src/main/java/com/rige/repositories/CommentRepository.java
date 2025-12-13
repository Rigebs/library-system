package com.rige.repositories;

import com.rige.entities.CommentEntity;
import com.rige.enums.CommentStatus;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {

    @EntityGraph(attributePaths = {
            "book",
            "user"
    })
    @NonNull
    List<CommentEntity> findAll();

    @EntityGraph(attributePaths = {
            "book",
            "user"
    })
    List<CommentEntity> findByStatus(CommentStatus status);

    long countByStatus(CommentStatus status);

    List<CommentEntity> findByBookIdAndStatus(Long bookId, CommentStatus status);
}