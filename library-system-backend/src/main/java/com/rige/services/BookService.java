package com.rige.services;

import com.rige.dto.request.BookRequest;
import com.rige.dto.response.BookResponse;

import java.util.List;

public interface BookService {
    List<BookResponse> findAllBooks();
    BookResponse findBookById(Long id);
    BookResponse saveBook(BookRequest request);
    void deleteBook(Long id);
    boolean isBookAvailable(Long bookId);
}