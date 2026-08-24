CREATE TABLE incoming_attachments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    incoming_document_id BIGINT UNSIGNED NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    object_name VARCHAR(500) NOT NULL,
    content_type VARCHAR(100),
    file_size BIGINT,
    created_at DATETIME NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_incoming_attachment_document
        FOREIGN KEY (incoming_document_id)
        REFERENCES incoming_documents(id)
);

CREATE INDEX idx_incoming_attachment_document
ON incoming_attachments(incoming_document_id);