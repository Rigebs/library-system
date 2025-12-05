package com.rige.services;

import com.rige.entities.BookEntity;

import java.util.List;
import java.util.Optional;

public interface BookService {

    List<BookEntity> findAllBooks();

    Optional<BookEntity> findBookById(Long id);

    BookEntity saveBook(BookEntity book);

    void deleteBook(Long id);

    boolean isBookAvailable(Long bookId);
}