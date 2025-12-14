package com.rige.specifications;

import com.rige.entities.BookEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

public class BookSpecification {

    public static Specification<BookEntity> hasKeyword(String term, String field) {
        return (root, query, cb) -> {

            if (term == null || term.isBlank()) {
                return cb.conjunction();
            }

            String likeTerm = "%" + term.toLowerCase() + "%";

            return switch (field.toLowerCase()) {

                case "title" ->
                        cb.like(cb.lower(root.get("title")), likeTerm);

                case "author" ->
                        cb.like(cb.lower(root.get("author")), likeTerm);

                case "isbn" ->
                        cb.equal(root.get("isbn"), term);

                case "publisher" ->
                        cb.like(cb.lower(root.get("publisher")), likeTerm);

                case "category" -> {
                    Join<Object, Object> categoryJoin =
                            root.join("category", JoinType.INNER);
                    yield cb.like(
                            cb.lower(categoryJoin.get("name")),
                            likeTerm
                    );
                }

                case "all" -> {
                    Predicate title =
                            cb.like(cb.lower(root.get("title")), likeTerm);
                    Predicate author =
                            cb.like(cb.lower(root.get("author")), likeTerm);
                    Predicate publisher =
                            cb.like(cb.lower(root.get("publisher")), likeTerm);

                    yield cb.or(title, author, publisher);
                }

                default -> cb.conjunction();
            };
        };
    }
}
