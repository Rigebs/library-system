package com.rige.controllers;

import com.rige.entities.BookEntity;
import com.rige.services.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<BookEntity> getAllBooks() {
        return bookService.findAllBooks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookEntity> getBookById(@PathVariable Long id) {
        return bookService.findBookById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/available")
    public boolean checkBookAvailability(@PathVariable Long id) {
        return bookService.isBookAvailable(id);
    }

    @PostMapping
    public BookEntity createBook(@RequestBody BookEntity book) {
        return bookService.saveBook(book);
    }
}