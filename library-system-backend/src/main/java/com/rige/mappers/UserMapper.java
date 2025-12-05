package com.rige.mappers;

import com.rige.dto.request.UserRequest;
import com.rige.dto.response.UserResponse;
import com.rige.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserResponse toResponse(UserEntity entity);

    @Mapping(target = "id", ignore = true)
    UserEntity toEntity(UserRequest request);
}