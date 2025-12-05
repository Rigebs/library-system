package com.rige.dto.request;

public record BookRequest(
    String title,
    String author,
    String isbn,
    String publisher,
    String summary,
    String fileUrl,
    String coverUrl,
    Integer totalQuantity
) {}