package com.rige.services;

import com.rige.dto.response.UserResponse;

import java.util.List;

public interface UserService {

    List<UserResponse> findAllUsers();

    UserResponse getAuthenticatedUser();

    UserResponse findUserById(Long id);

    void deleteUser(Long id);
}