package com.rige.services;

import com.rige.dto.request.CommentRequest;
import com.rige.dto.response.CommentResponse;
import com.rige.enums.CommentStatus;

import java.util.List;

public interface CommentService {

  public List<CommentResponse> findAllComments();

  long countByStatus(CommentStatus status);

  CommentResponse createComment(CommentRequest request);

  CommentResponse updateCommentStatus(Long id, CommentStatus newStatus);
}
