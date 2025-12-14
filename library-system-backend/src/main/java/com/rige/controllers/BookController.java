package com.rige.controllers;

import com.rige.dto.request.BookRequest;
import com.rige.dto.response.ApiResponse;
import com.rige.dto.response.BookResponse;
import com.rige.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<BookResponse>>> getAllBooks(
            @RequestParam(required = false) String term,
            @RequestParam(required = false, defaultValue = "all") String field
    ) {
        List<BookResponse> books;

        if (term != null && !term.trim().isEmpty()) {
            books = bookService.searchBooks(term, field);
            return ResponseEntity.ok(
                    ApiResponse.success(books, "Search results retrieved successfully")
            );
        } else {
            books = bookService.findAllBooks();
            return ResponseEntity.ok(
                    ApiResponse.success(books, "Book list retrieved successfully")
            );
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable Long id) {
        try {
            BookResponse response = bookService.findBookById(id);
            return ResponseEntity.ok(
                    ApiResponse.success(response, "Book found successfully")
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error(e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @GetMapping("/{id}/available")
    public ResponseEntity<ApiResponse<Boolean>> checkBookAvailability(@PathVariable Long id) {
        try {
            boolean available = bookService.isBookAvailable(id);
            String message = available
                    ? "Book is available for loan."
                    : "Book is currently NOT available for loan.";

            return ResponseEntity.ok(
                    ApiResponse.success(available, message)
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error(e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookResponse>> createBook(@RequestBody BookRequest request) {
        BookResponse response = bookService.saveBook(request);
        return new ResponseEntity<>(
                ApiResponse.success(response, "Book created successfully"),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<BookResponse>> updateBook(@PathVariable Long id,
                                                                @RequestBody BookRequest request) {
        BookResponse response = bookService.updateBook(id, request);
        return ResponseEntity.ok(
                ApiResponse.success(response, "Book updated successfully")
        );
    }
}