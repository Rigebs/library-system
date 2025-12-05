package com.rige.controllers;

import com.rige.dto.response.ApiResponse;
import com.rige.dto.response.UserResponse;
import com.rige.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.findAllUsers();
        return ResponseEntity.ok(
                ApiResponse.success(users, "Users retrieved successfully")
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable Long id) {
        try {
            UserResponse response = userService.findUserById(id);
            return ResponseEntity.ok(
                    ApiResponse.success(response, "User found")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error(e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return new ResponseEntity<>(
                    ApiResponse.success(null, "User deleted successfully"),
                    HttpStatus.NO_CONTENT
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error(e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }
}