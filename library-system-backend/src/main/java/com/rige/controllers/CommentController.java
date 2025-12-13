package com.rige.controllers;

import com.rige.dto.request.CommentRequest;
import com.rige.dto.response.ApiResponse;
import com.rige.dto.response.CommentResponse;
import com.rige.enums.CommentStatus;
import com.rige.services.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<CommentResponse>> createComment(@RequestBody CommentRequest request) {
        CommentResponse response = commentService.createComment(request);
        return new ResponseEntity<>(
                ApiResponse.success(response, "Comment submitted successfully for moderation"),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/moderation")
    public ResponseEntity<ApiResponse<List<CommentResponse>>> getAllCommentsForModeration() {
        List<CommentResponse> comments = commentService.findAllComments();
        return ResponseEntity.ok(
                ApiResponse.success(comments, "Comment list retrieved successfully for moderation")
        );
    }

    @PatchMapping("/moderation/{id}/status")
    public ResponseEntity<ApiResponse<CommentResponse>> updateCommentStatus(
            @PathVariable Long id,
            @RequestParam CommentStatus status) {

        try {
            CommentResponse response = commentService.updateCommentStatus(id, status);
            String message = String.format("Comment ID %d status updated to %s", id, status);
            return ResponseEntity.ok(
                    ApiResponse.success(response, message)
            );
        } catch (RuntimeException e) {
            return new ResponseEntity<>(
                    ApiResponse.error(e.getMessage()),
                    HttpStatus.NOT_FOUND
            );
        }
    }
}