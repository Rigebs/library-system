package com.rige.mappers;

import com.rige.dto.request.BookRequest;
import com.rige.dto.response.BookResponse;
import com.rige.entities.BookEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface BookMapper {

    BookMapper INSTANCE = Mappers.getMapper(BookMapper.class);

    BookResponse toResponse(BookEntity entity);

    BookEntity toEntity(BookRequest request);
}