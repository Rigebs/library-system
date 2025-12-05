package com.rige.mappers;

import com.rige.entities.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    // Mapea la Entity al Response (ignora la contraseña)
    @Mapping(target = "password", ignore = true)
    UserResponse toResponse(UserEntity entity);

    @Mapping(target = "contrasenaCifrada", source = "password")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "fechaRegistro", ignore = true)
    UserEntity toEntity(UserRequest request);
}