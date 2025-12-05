package com.rige.mappers;

import com.rige.entities.LoanEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring", uses = {UserMapper.class, BookMapper.class})
public interface LoanMapper {

    LoanMapper INSTANCE = Mappers.getMapper(LoanMapper.class);

    LoanResponse toResponse(LoanEntity entity);
}