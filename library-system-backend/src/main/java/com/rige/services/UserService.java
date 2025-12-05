package com.rige.services;

import com.rige.entities.UserEntity;

import java.util.List;
import java.util.Optional;

public interface UserService {
    
    List<UserEntity> findAllUsers();
    
    Optional<UserEntity> findUserById(Long id);
    
    UserEntity findUserByEmail(String email);
    
    UserEntity saveUser(UserEntity user);
    
    void deleteUser(Long id);
}