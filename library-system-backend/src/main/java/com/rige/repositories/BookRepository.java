package com.rige.repositories;

import com.rige.entities.BookEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<BookEntity, Long>, JpaSpecificationExecutor<BookEntity> {

    Optional<BookEntity> findByIsbn(String isbn);

    @Override
    @NonNull
    @EntityGraph(attributePaths = {
            "category"
    })
    List<BookEntity> findAll(@NonNull Specification<BookEntity> spec);

    @Override
    @NonNull
    @EntityGraph(attributePaths = {
            "category"
    })
    List<BookEntity> findAll();
}