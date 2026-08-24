package com.qlvb.mofa.specification;

import com.qlvb.mofa.entity.IncomingDocument;

import jakarta.persistence.criteria.Predicate;

import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public final class IncomingDocumentSpecification {

    private IncomingDocumentSpecification() {
    }

    public static Specification<IncomingDocument> search(
            Long unitId,
            String keyword,
            String incomingNumber,
            String documentNumber,
            String summary,
            String issuingAgency,
            String documentType,
            String status,
            String urgencyLevel,
            String securityLevel,
            LocalDate fromDate,
            LocalDate toDate,
            Integer year
    ) {

        return (root, query, cb) -> {

            List<Predicate> predicates = new ArrayList<>();

            predicates.add(
                    cb.equal(
                            root.get("unit").get("id"),
                            unitId
                    )
            );

            if (keyword != null && !keyword.isBlank()) {

                String value =
                        "%" + keyword.trim().toLowerCase() + "%";

                Predicate p1 = cb.like(
                        cb.lower(root.get("incomingNumber")),
                        value
                );

                Predicate p2 = cb.like(
                        cb.lower(root.get("documentNumber")),
                        value
                );

                Predicate p3 = cb.like(
                        cb.lower(root.get("summary")),
                        value
                );

                Predicate p4 = cb.like(
                        cb.lower(root.get("issuingAgency")),
                        value
                );

                predicates.add(
                        cb.or(p1, p2, p3, p4)
                );
            }

            if (incomingNumber != null
                    && !incomingNumber.isBlank()) {

                predicates.add(
                        cb.like(
                                cb.lower(
                                        root.get("incomingNumber")
                                ),
                                "%" + incomingNumber
                                        .trim()
                                        .toLowerCase()
                                        + "%"
                        )
                );
            }

            if (documentNumber != null
                    && !documentNumber.isBlank()) {

                predicates.add(
                        cb.like(
                                cb.lower(
                                        root.get("documentNumber")
                                ),
                                "%" + documentNumber
                                        .trim()
                                        .toLowerCase()
                                        + "%"
                        )
                );
            }

            if (summary != null
                    && !summary.isBlank()) {

                predicates.add(
                        cb.like(
                                cb.lower(root.get("summary")),
                                "%" + summary.trim().toLowerCase() + "%"
                        )
                );
            }

            if (issuingAgency != null
                    && !issuingAgency.isBlank()) {

                predicates.add(
                        cb.like(
                                cb.lower(
                                        root.get("issuingAgency")
                                ),
                                "%" + issuingAgency
                                        .trim()
                                        .toLowerCase()
                                        + "%"
                        )
                );
            }

            if (documentType != null
                    && !documentType.isBlank()) {

                predicates.add(
                        cb.equal(
                                root.get("documentType"),
                                documentType
                        )
                );
            }

            if (status != null
                    && !status.isBlank()) {

                predicates.add(
                        cb.equal(
                                root.get("status"),
                                status
                        )
                );
            }

            if (urgencyLevel != null
                    && !urgencyLevel.isBlank()) {

                predicates.add(
                        cb.equal(
                                root.get("urgencyLevel"),
                                urgencyLevel
                        )
                );
            }

            if (securityLevel != null
                    && !securityLevel.isBlank()) {

                predicates.add(
                        cb.equal(
                                root.get("securityLevel"),
                                securityLevel
                        )
                );
            }

            if (fromDate != null) {

                LocalDateTime from =
                        fromDate.atStartOfDay();

                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("arrivalDate"),
                                from
                        )
                );
            }

            if (toDate != null) {

                LocalDateTime to =
                        toDate.plusDays(1)
                                .atStartOfDay();

                predicates.add(
                        cb.lessThan(
                                root.get("arrivalDate"),
                                to
                        )
                );
            }
            if (year != null) {

                LocalDateTime from =
                        LocalDate.of(year, 1, 1)
                                .atStartOfDay();

                LocalDateTime to =
                        LocalDate.of(year + 1, 1, 1)
                                .atStartOfDay();

                predicates.add(
                        cb.greaterThanOrEqualTo(
                                root.get("arrivalDate"),
                                from
                        )
                );

                predicates.add(
                        cb.lessThan(
                                root.get("arrivalDate"),
                                to
                        )
                );
            }

            return cb.and(
                    predicates.toArray(new Predicate[0])
            );
        };
    }
}