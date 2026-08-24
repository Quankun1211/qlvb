package com.qlvb.mofa.specification;

import com.qlvb.mofa.dto.enums.DocumentClassification;
import com.qlvb.mofa.dto.enums.GroupType;
import com.qlvb.mofa.entity.FrequentGroup;

import org.springframework.data.jpa.domain.Specification;

public class FrequentGroupSpecification {

    public static Specification<FrequentGroup> keyword(
            String keyword
    ) {

        return (root, query, cb) -> {

            if (keyword == null || keyword.isBlank()) {
                return null;
            }

            String value =
                    "%" + keyword.trim().toLowerCase() + "%";

            return cb.or(
                    cb.like(
                            cb.lower(root.get("name")),
                            value
                    ),
                    cb.like(
                            cb.lower(root.get("shortName")),
                            value
                    ),
                    cb.like(
                            cb.lower(root.get("description")),
                            value
                    )
            );
        };
    }


    public static Specification<FrequentGroup> documentClassification(
            DocumentClassification classification
    ) {

        return (root, query, cb) -> {

            if (classification == null) {
                return null;
            }

            return cb.equal(
                    root.get("documentClassification"),
                    classification
            );
        };
    }


    public static Specification<FrequentGroup> groupType(
            GroupType groupType
    ) {

        return (root, query, cb) -> {

            if (groupType == null) {
                return null;
            }

            return cb.equal(
                    root.get("groupType"),
                    groupType
            );
        };
    }


    public static Specification<FrequentGroup> status(
            Byte status
    ) {

        return (root, query, cb) -> {

            if (status == null) {
                return null;
            }

            return cb.equal(
                    root.get("status"),
                    status
            );
        };
    }
}