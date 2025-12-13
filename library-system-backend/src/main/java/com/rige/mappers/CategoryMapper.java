package com.rige.mappers;

import com.rige.dto.request.CategoryRequest;
import com.rige.dto.response.CategoryResponse;
import com.rige.entities.CategoryEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    CategoryResponse toResponse(CategoryEntity entity);
    CategoryEntity toEntity(CategoryRequest request);
}