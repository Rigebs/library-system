package com.rige.dto.response;

public record BookResponse(
        Long id,
        String title,
        String author,
        String isbn,
        String publisher,
        String summary,
        String coverUrl,
        String fileUrl,
        Integer totalQuantity,
        CategoryResponse category
) {}