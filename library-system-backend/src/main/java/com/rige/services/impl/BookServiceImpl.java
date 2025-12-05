package com.rige.services.impl;

import com.rige.entities.BookEntity;
import com.rige.repositories.BookRepository;
import com.rige.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Override
    public List<BookEntity> findAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Optional<BookEntity> findBookById(Long id) {
        return bookRepository.findById(id);
    }

    @Override
    public BookEntity saveBook(BookEntity book) {
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public boolean isBookAvailable(Long bookId) {
        return bookRepository.existsById(bookId);
    }
}