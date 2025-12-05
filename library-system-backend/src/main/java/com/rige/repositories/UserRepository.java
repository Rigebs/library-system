package com.rige.repositories;

import com.rige.entities.UserEntity;
import org.jspecify.annotations.NonNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    @NonNull
    Optional<UserEntity> findByEmail(@NonNull String email);
}