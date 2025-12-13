package com.rige.mappers;

import com.rige.dto.request.CommentRequest;
import com.rige.dto.response.CommentResponse;
import com.rige.entities.CommentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        uses = { BookMapper.class, UserMapper.class } )
public interface CommentMapper {

    CommentResponse toResponse(CommentEntity entity);

    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    CommentEntity toEntity(CommentRequest request);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntity(CommentRequest request, @MappingTarget CommentEntity entity);
}