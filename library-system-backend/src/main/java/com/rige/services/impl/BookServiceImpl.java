package com.rige.services.impl;

import com.rige.dto.request.BookRequest;
import com.rige.dto.response.BookResponse;
import com.rige.entities.BookEntity;
import com.rige.entities.CategoryEntity;
import com.rige.enums.LoanStatus;
import com.rige.mappers.BookMapper;
import com.rige.repositories.BookRepository;
import com.rige.repositories.CategoryRepository;
import com.rige.repositories.LoanRepository;
import com.rige.services.BookService;
import com.rige.specifications.BookSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final LoanRepository loanRepository;
    private final CategoryRepository categoryRepository;
    private final BookMapper bookMapper;

    @Override
    public List<BookResponse> findAllBooks() {
        return bookRepository.findAll().stream()
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookResponse> searchBooks(String term, String field) {
        Specification<BookEntity> spec = BookSpecification.hasKeyword(term, field);

        List<BookEntity> results = bookRepository.findAll(spec);

        return results.stream()
                .map(bookMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookResponse findBookById(Long id) {
        BookEntity book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
        return bookMapper.toResponse(book);
    }

    @Override
    public BookResponse saveBook(BookRequest request) {
        BookEntity book = bookMapper.toEntity(request);

        CategoryEntity category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.categoryId()));

        book.setCategory(category);

        BookEntity savedBook = bookRepository.save(book);
        return bookMapper.toResponse(savedBook);
    }

    @Override
    public BookResponse updateBook(Long id, BookRequest request) {
        BookEntity existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with ID: " + id));

        CategoryEntity category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with ID: " + request.categoryId()));

        bookMapper.updateEntity(request, existingBook);
        existingBook.setCategory(category);

        BookEntity updatedBook = bookRepository.save(existingBook);
        return bookMapper.toResponse(updatedBook);
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public boolean isBookAvailable(Long bookId) {
        BookEntity book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        long activeLoans = loanRepository.findByBookIdAndStatus(bookId, LoanStatus.ACTIVE).size();

        return book.getTotalQuantity() > activeLoans;
    }
}