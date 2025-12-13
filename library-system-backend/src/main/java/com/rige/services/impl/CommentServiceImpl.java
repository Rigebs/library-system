package com.rige.services.impl;

import com.rige.dto.request.CommentRequest;
import com.rige.dto.response.CommentResponse;
import com.rige.entities.BookEntity;
import com.rige.entities.CommentEntity;
import com.rige.entities.UserEntity;
import com.rige.enums.CommentStatus;
import com.rige.mappers.CommentMapper;
import com.rige.repositories.BookRepository;
import com.rige.repositories.CommentRepository;
import com.rige.repositories.UserRepository;
import com.rige.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> findAllComments() {
        return commentRepository.findAll().stream()
                .map(commentMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long countByStatus(CommentStatus status) {
        return commentRepository.countByStatus(status);
    }

    @Override
    @Transactional
    public CommentResponse createComment(CommentRequest request) {
        // 1. Obtener entidades relacionadas
        BookEntity book = bookRepository.findById(request.bookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        UserEntity user = userRepository.findById(request.userId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommentEntity comment = new CommentEntity();
        comment.setText(request.text());
        comment.setBook(book);
        comment.setUser(user);
        comment.setStatus(CommentStatus.PENDING);

        CommentEntity savedComment = commentRepository.save(comment);
        return commentMapper.toResponse(savedComment);
    }

    @Override
    @Transactional
    public CommentResponse updateCommentStatus(Long id, CommentStatus newStatus) {
        CommentEntity comment = commentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found with ID: " + id));

        comment.setStatus(newStatus);
        
        CommentEntity updatedComment = commentRepository.save(comment);
        return commentMapper.toResponse(updatedComment);
    }
}