package com.rige.services.impl;

import com.rige.dto.request.CategoryRequest;
import com.rige.dto.response.CategoryResponse;
import com.rige.entities.CategoryEntity;
import com.rige.mappers.CategoryMapper;
import com.rige.repositories.CategoryRepository;
import com.rige.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Override
    public List<CategoryResponse> findAll() {
        return categoryRepository.findAll().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryResponse findById(Long id) {
        CategoryEntity category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        CategoryEntity entity = categoryMapper.toEntity(request);
        CategoryEntity savedEntity = categoryRepository.save(entity);
        return categoryMapper.toResponse(savedEntity);
    }

    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {
        CategoryEntity entity = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + id));

        entity.setName(request.name());
        CategoryEntity updatedEntity = categoryRepository.save(entity);
        return categoryMapper.toResponse(updatedEntity);
    }

    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new RuntimeException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}