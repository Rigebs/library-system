package com.rige.controllers;

import com.rige.dto.request.CategoryRequest;
import com.rige.dto.response.ApiResponse;
import com.rige.dto.response.CategoryResponse;
import com.rige.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getAllCategories() {
        List<CategoryResponse> categories = categoryService.findAll();
        return ResponseEntity.ok(
                ApiResponse.success(categories, "Categories list retrieved successfully")
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(@PathVariable Long id) {
        try {
            CategoryResponse category = categoryService.findById(id);
            return ResponseEntity.ok(
                    ApiResponse.success(category, "Category retrieved successfully")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error("Failed to retrieve category: " + e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(@RequestBody CategoryRequest request) {
        try {
            CategoryResponse newCategory = categoryService.create(request);
            return new ResponseEntity<>(
                    ApiResponse.success(newCategory, "Category created successfully"),
                    HttpStatus.CREATED
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error("Failed to create category: " + e.getMessage()),
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory(
            @PathVariable Long id,
            @RequestBody CategoryRequest request) {
        try {
            CategoryResponse updatedCategory = categoryService.update(id, request);
            return ResponseEntity.ok(
                    ApiResponse.success(updatedCategory, "Category updated successfully")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error("Failed to update category: " + e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.delete(id);
            return ResponseEntity.ok(
                    ApiResponse.success(null, "Category deleted successfully")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error("Failed to delete category: " + e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }
}