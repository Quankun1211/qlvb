SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS incoming_attachments;
DROP TABLE IF EXISTS work_record_items;
DROP TABLE IF EXISTS work_record_members;
DROP TABLE IF EXISTS work_history;
DROP TABLE IF EXISTS work_collaborators;
DROP TABLE IF EXISTS work_assignees;
DROP TABLE IF EXISTS works;
DROP TABLE IF EXISTS work_records;

DROP TABLE IF EXISTS outgoing_recipients;
DROP TABLE IF EXISTS outgoing_documents;

DROP TABLE IF EXISTS draft_history;
DROP TABLE IF EXISTS draft_comments;
DROP TABLE IF EXISTS draft_documents;

DROP TABLE IF EXISTS submission_history;
DROP TABLE IF EXISTS submission_comments;
DROP TABLE IF EXISTS submissions;

DROP TABLE IF EXISTS group_members;
DROP TABLE IF EXISTS frequent_groups;

DROP TABLE IF EXISTS incoming_processing_history;
DROP TABLE IF EXISTS incoming_collaborators;
DROP TABLE IF EXISTS incoming_assignments;
DROP TABLE IF EXISTS incoming_documents;

DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS help_documents;
DROP TABLE IF EXISTS documents;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS units;

CREATE TABLE units (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(50) NOT NULL,
    name                VARCHAR(255) NOT NULL,
    short_name          VARCHAR(100),
    parent_id           BIGINT UNSIGNED NULL,
    unit_type           VARCHAR(50),
    status              TINYINT NOT NULL DEFAULT 1,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_units_code (code),
    KEY idx_units_parent (parent_id),
    CONSTRAINT fk_units_parent FOREIGN KEY (parent_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE departments (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code                VARCHAR(50) NOT NULL,
    name                VARCHAR(255) NOT NULL,
    unit_id             BIGINT UNSIGNED NOT NULL,
    parent_id           BIGINT UNSIGNED NULL,
    status              TINYINT NOT NULL DEFAULT 1,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_departments_code (code),
    KEY idx_departments_unit (unit_id),
    KEY idx_departments_parent (parent_id),
    CONSTRAINT fk_departments_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_departments_parent FOREIGN KEY (parent_id) REFERENCES departments(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE users (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username            VARCHAR(100) NOT NULL,
    password_hash       VARCHAR(255) NOT NULL,
    role                ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    full_name           VARCHAR(255) NOT NULL,
    email               VARCHAR(255),
    department_id       BIGINT UNSIGNED NULL,
    unit_id             BIGINT UNSIGNED NULL,
    status              TINYINT NOT NULL DEFAULT 1,
    last_login_at       DATETIME NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_users_username (username),
    UNIQUE KEY uk_users_email (email),
    KEY idx_users_role (role),
    KEY idx_users_department (department_id),
    KEY idx_users_unit (unit_id),
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_users_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE documents (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_type       VARCHAR(30) NOT NULL,
    incoming_number     VARCHAR(50),
    outgoing_number     VARCHAR(50),
    reference_number    VARCHAR(100),
    subject             TEXT NOT NULL,
    issue_date          DATE NULL,
    received_date       DATE NULL,
    issuing_unit_id     BIGINT UNSIGNED NULL,
    receiving_unit_id   BIGINT UNSIGNED NULL,
    created_by          BIGINT UNSIGNED NULL,
    status              VARCHAR(100) NOT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_documents_type_status (document_type, status),
    KEY idx_documents_received_date (received_date),
    KEY idx_documents_issue_date (issue_date),
    KEY idx_documents_reference_number (reference_number),
    CONSTRAINT fk_documents_issuing_unit FOREIGN KEY (issuing_unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_documents_receiving_unit FOREIGN KEY (receiving_unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_documents_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE incoming_documents (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id         BIGINT UNSIGNED NOT NULL,
    incoming_number     VARCHAR(50) NOT NULL,
    received_date       DATE NOT NULL,
    receipt_type        VARCHAR(50),
    response_required   TINYINT NOT NULL DEFAULT 0,
    status              ENUM('UNPROCESSED', 'PROCESSING', 'COMPLETED', 'SUSPENDED') NOT NULL DEFAULT 'UNPROCESSED',
    receiving_unit_id   BIGINT UNSIGNED NOT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_incoming_document (document_id),
    KEY idx_incoming_number (incoming_number),
    KEY idx_incoming_status (status),
    KEY idx_incoming_received_date (received_date),
    KEY idx_incoming_unit (receiving_unit_id),
    CONSTRAINT fk_incoming_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_incoming_unit FOREIGN KEY (receiving_unit_id) REFERENCES units(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE incoming_attachments (
    id                   BIGINT NOT NULL AUTO_INCREMENT,
    incoming_document_id BIGINT UNSIGNED NOT NULL,
    file_name            VARCHAR(255) NOT NULL,
    object_name          VARCHAR(500) NOT NULL,
    content_type         VARCHAR(100),
    file_size            BIGINT,
    created_at           DATETIME NOT NULL,
    PRIMARY KEY (id),
    KEY idx_incoming_attachment_document (incoming_document_id),
    CONSTRAINT fk_incoming_attachment_document FOREIGN KEY (incoming_document_id) REFERENCES incoming_documents(id)
);

CREATE TABLE incoming_assignments (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    incoming_document_id    BIGINT UNSIGNED NOT NULL,
    assigned_by             BIGINT UNSIGNED NOT NULL,
    lead_user_id            BIGINT UNSIGNED NULL,
    lead_unit_id            BIGINT UNSIGNED NULL,
    assigned_at             DATETIME NOT NULL,
    due_at                  DATETIME NULL,
    work_type               ENUM('RESPONSE_REQUIRED', 'NO_RESPONSE_REQUIRED') NULL,
    notification_type       ENUM('OVERDUE', 'NEAR_DEADLINE') NULL,
    status                  ENUM('UNPROCESSED', 'PROCESSING', 'COMPLETED', 'SUSPENDED', 'CANCELLED', 'REJECTED') NOT NULL DEFAULT 'UNPROCESSED',
    return_reason           TEXT NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_incoming_assignments_document (incoming_document_id),
    KEY idx_incoming_assignments_status (status),
    KEY idx_incoming_assignments_due_at (due_at),
    KEY idx_incoming_assignments_lead_user (lead_user_id),
    CONSTRAINT fk_incoming_assignments_document FOREIGN KEY (incoming_document_id) REFERENCES incoming_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_incoming_assignments_by FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_incoming_assignments_lead_user FOREIGN KEY (lead_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_incoming_assignments_lead_unit FOREIGN KEY (lead_unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE incoming_collaborators (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    assignment_id       BIGINT UNSIGNED NOT NULL,
    user_id             BIGINT UNSIGNED NULL,
    unit_id             BIGINT UNSIGNED NULL,
    assigned_at         DATETIME NOT NULL,
    status              VARCHAR(50),
    KEY idx_incoming_collab_assignment (assignment_id),
    KEY idx_incoming_collab_user (user_id),
    KEY idx_incoming_collab_unit (unit_id),
    CONSTRAINT fk_incoming_collab_assignment FOREIGN KEY (assignment_id) REFERENCES incoming_assignments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_incoming_collab_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_incoming_collab_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE incoming_processing_history (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    incoming_document_id    BIGINT UNSIGNED NOT NULL,
    processed_by            BIGINT UNSIGNED NOT NULL,
    action                  VARCHAR(100) NOT NULL,
    old_status              VARCHAR(50),
    new_status              VARCHAR(50),
    content                 TEXT,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_incoming_history_document (incoming_document_id),
    KEY idx_incoming_history_user (processed_by),
    CONSTRAINT fk_incoming_history_document FOREIGN KEY (incoming_document_id) REFERENCES incoming_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_incoming_history_user FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE frequent_groups (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name                    VARCHAR(255) NOT NULL,
    short_name              VARCHAR(100),
    document_classification ENUM('INTERNAL', 'INTERCONNECTED') NOT NULL,
    group_type              ENUM('UNIT', 'DEPARTMENT', 'USER') NOT NULL,
    description             TEXT,
    status                  TINYINT NOT NULL DEFAULT 1,
    created_by              BIGINT UNSIGNED NOT NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_groups_classification (document_classification),
    KEY idx_groups_type (group_type),
    CONSTRAINT fk_groups_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE group_members (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id            BIGINT UNSIGNED NOT NULL,
    user_id             BIGINT UNSIGNED NULL,
    department_id       BIGINT UNSIGNED NULL,
    unit_id             BIGINT UNSIGNED NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_group_member_unit (group_id, unit_id),
    UNIQUE KEY uk_group_member_department (group_id, department_id),
    UNIQUE KEY uk_group_member_user (group_id, user_id),
    KEY idx_group_members_group (group_id),
    KEY idx_group_members_user (user_id),
    KEY idx_group_members_department (department_id),
    KEY idx_group_members_unit (unit_id),
    CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES frequent_groups(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_group_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_group_members_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_group_members_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE submissions (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id         BIGINT UNSIGNED NULL,
    submission_number   VARCHAR(100) NOT NULL,
    subject             TEXT NOT NULL,
    drafted_by          BIGINT UNSIGNED NOT NULL,
    submitted_at        DATE NOT NULL,
    department_id       BIGINT UNSIGNED NOT NULL,
    target              VARCHAR(255),
    status              ENUM(
                            'DRAFTING', 'REQUESTING_OPINION', 'SUBMITTING_UNIT_LEADER', 'APPROVED',
                            'WAITING_MINISTRY_LEADER', 'WAITING_SECRETARY_RECEIPT', 'WAITING_MINISTRY_LEADER_SIGN',
                            'MINISTRY_LEADER_SIGNED', 'WAITING_MINISTRY_OFFICE', 'PUBLISHED', 'DEPARTMENT_RETURNED',
                            'UNIT_LEADER_RETURNED', 'UNIT_OFFICE_RETURNED', 'MINISTRY_SECRETARY_RETURNED',
                            'MINISTRY_LEADER_RETURNED', 'MINISTER_RETURNED', 'MINISTRY_OFFICE_RETURNED',
                            'TRANSFERRED_TO_ORGANIZATION', 'REQUESTING_MINISTRY_LEADER_OPINION',
                            'MINISTRY_LEADER_SIGNED_REQUESTING_OPINION', 'SUBMITTING_MINISTRY_LEADER', 'REDONE', 'SUSPENDED'
                        ) NOT NULL DEFAULT 'DRAFTING',
    published_at        DATETIME NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_submissions_status (status),
    KEY idx_submissions_date (submitted_at),
    KEY idx_submissions_drafted_by (drafted_by),
    CONSTRAINT fk_submissions_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_submissions_drafted_by FOREIGN KEY (drafted_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_submissions_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE submission_comments (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_id           BIGINT UNSIGNED NOT NULL,
    requested_from_user_id  BIGINT UNSIGNED NULL,
    requested_from_unit_id  BIGINT UNSIGNED NULL,
    content                 TEXT,
    sent_at                 DATETIME NOT NULL,
    due_at                  DATETIME NULL,
    replied_at              DATETIME NULL,
    status                  VARCHAR(50),
    KEY idx_submission_comments_submission (submission_id),
    CONSTRAINT fk_submission_comments_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_submission_comments_user FOREIGN KEY (requested_from_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_submission_comments_unit FOREIGN KEY (requested_from_unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE submission_history (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    submission_id   BIGINT UNSIGNED NOT NULL,
    performed_by    BIGINT UNSIGNED NOT NULL,
    old_status      VARCHAR(100),
    new_status      VARCHAR(100),
    action          VARCHAR(100) NOT NULL,
    content         TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_submission_history_submission (submission_id),
    CONSTRAINT fk_submission_history_submission FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_submission_history_user FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE draft_documents (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id         BIGINT UNSIGNED NULL,
    drafted_by          BIGINT UNSIGNED NOT NULL,
    approving_leader_id BIGINT UNSIGNED NULL,
    submitted_at        DATE NOT NULL,
    subject             TEXT NOT NULL,
    status              ENUM('DRAFTING', 'REQUESTING_OPINION', 'SUBMITTING_UNIT_LEADER', 'APPROVED', 'DEPARTMENT_RETURNED', 'UNIT_LEADER_RETURNED', 'PUBLISHED', 'SUSPENDED') NOT NULL DEFAULT 'DRAFTING',
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_drafts_status (status),
    KEY idx_drafts_date (submitted_at),
    KEY idx_drafts_drafted_by (drafted_by),
    CONSTRAINT fk_drafts_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_drafts_drafted_by FOREIGN KEY (drafted_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_drafts_approving_leader FOREIGN KEY (approving_leader_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE draft_comments (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    draft_document_id   BIGINT UNSIGNED NOT NULL,
    reviewer_id         BIGINT UNSIGNED NOT NULL,
    content             TEXT,
    sent_at             DATETIME NOT NULL,
    replied_at          DATETIME NULL,
    status              VARCHAR(50),
    KEY idx_draft_comments_draft (draft_document_id),
    CONSTRAINT fk_draft_comments_draft FOREIGN KEY (draft_document_id) REFERENCES draft_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_draft_comments_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE draft_history (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    draft_document_id   BIGINT UNSIGNED NOT NULL,
    performed_by        BIGINT UNSIGNED NOT NULL,
    old_status          VARCHAR(100),
    new_status          VARCHAR(100),
    action              VARCHAR(100) NOT NULL,
    content             TEXT,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_draft_history_draft (draft_document_id),
    CONSTRAINT fk_draft_history_draft FOREIGN KEY (draft_document_id) REFERENCES draft_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_draft_history_user FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE outgoing_documents (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    document_id         BIGINT UNSIGNED NULL,
    draft_document_id   BIGINT UNSIGNED NULL,
    outgoing_number     VARCHAR(50),
    reference_number    VARCHAR(100),
    issue_date          DATE NOT NULL,
    subject             TEXT NOT NULL,
    drafted_by          BIGINT UNSIGNED NOT NULL,
    signed_by           BIGINT UNSIGNED NOT NULL,
    status              ENUM('DRAFTING', 'PUBLISHED', 'SUSPENDED', 'RECALLED', 'REPLACED', 'RETAKEN') NOT NULL DEFAULT 'DRAFTING',
    attachment_name     VARCHAR(255),
    attachment_path     VARCHAR(255),
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_outgoing_status (status),
    KEY idx_outgoing_issue_date (issue_date),
    KEY idx_outgoing_number (outgoing_number),
    CONSTRAINT fk_outgoing_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_outgoing_draft_document FOREIGN KEY (draft_document_id) REFERENCES draft_documents(id),
    CONSTRAINT fk_outgoing_drafted_by FOREIGN KEY (drafted_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_outgoing_signed_by FOREIGN KEY (signed_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE outgoing_recipients (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    outgoing_document_id    BIGINT UNSIGNED NOT NULL,
    unit_id                 BIGINT UNSIGNED NULL,
    department_id           BIGINT UNSIGNED NULL,
    user_id                 BIGINT UNSIGNED NULL,
    group_id                BIGINT UNSIGNED NULL,
    recipient_type          VARCHAR(50) NOT NULL,
    delivery_status         VARCHAR(50),
    sent_at                 DATETIME NULL,
    KEY idx_outgoing_recipient_document (outgoing_document_id),
    CONSTRAINT fk_outgoing_recipients_document FOREIGN KEY (outgoing_document_id) REFERENCES outgoing_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_outgoing_recipients_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_outgoing_recipients_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_outgoing_recipients_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_outgoing_recipients_group FOREIGN KEY (group_id) REFERENCES frequent_groups(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE work_records (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code            VARCHAR(255),
    record_number   VARCHAR(255),
    name            VARCHAR(500) NOT NULL,
    assigned_at     DATETIME NOT NULL,
    due_at          DATETIME NULL,
    created_by      BIGINT UNSIGNED NOT NULL,
    status          ENUM('PROCESSING', 'COMPLETED') NOT NULL DEFAULT 'PROCESSING',
    description     TEXT,
    attachment_name VARCHAR(255),
    attachment_path VARCHAR(255),
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_work_records_status (status),
    CONSTRAINT fk_work_records_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE works (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name                    VARCHAR(500) NOT NULL,
    incoming_document_id    BIGINT UNSIGNED NULL,
    work_record_id          BIGINT UNSIGNED NULL,
    assigned_by             BIGINT UNSIGNED NOT NULL,
    assigned_at             DATETIME NOT NULL,
    due_at                  DATETIME NULL,
    work_type               ENUM('RESPONSE_REQUIRED', 'NO_RESPONSE_REQUIRED') NULL,
    notification_type       ENUM('OVERDUE', 'NEAR_DEADLINE') NULL,
    status                  ENUM('UNPROCESSED', 'PROCESSING', 'COMPLETED', 'SUSPENDED') NOT NULL DEFAULT 'UNPROCESSED',
    description             TEXT,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_works_status (status),
    KEY idx_works_due_at (due_at),
    KEY idx_works_record (work_record_id),
    CONSTRAINT fk_works_incoming FOREIGN KEY (incoming_document_id) REFERENCES incoming_documents(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_works_record FOREIGN KEY (work_record_id) REFERENCES work_records(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_works_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE work_assignees (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    work_id         BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NULL,
    unit_id         BIGINT UNSIGNED NULL,
    KEY idx_work_assignees_work (work_id),
    CONSTRAINT fk_work_assignees_work FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_work_assignees_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_work_assignees_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE work_collaborators (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    work_id         BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NULL,
    unit_id         BIGINT UNSIGNED NULL,
    KEY idx_work_collaborators_work (work_id),
    CONSTRAINT fk_work_collaborators_work FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_work_collaborators_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_work_collaborators_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE work_history (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    work_id         BIGINT UNSIGNED NOT NULL,
    performed_by    BIGINT UNSIGNED NOT NULL,
    old_status      VARCHAR(50),
    new_status      VARCHAR(50),
    action          VARCHAR(100) NOT NULL,
    content         TEXT,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_work_history_work (work_id),
    CONSTRAINT fk_work_history_work FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_work_history_user FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE work_record_members (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    work_record_id  BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NULL,
    unit_id         BIGINT UNSIGNED NULL,
    role            ENUM('OWNER', 'COLLABORATOR', 'FOLLOWER') NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_work_record_members_record (work_record_id),
    CONSTRAINT fk_work_record_members_record FOREIGN KEY (work_record_id) REFERENCES work_records(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_work_record_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_work_record_members_unit FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE work_record_items (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    work_record_id  BIGINT UNSIGNED NOT NULL,
    work_id         BIGINT UNSIGNED NOT NULL,
    UNIQUE KEY uk_work_record_item (work_record_id, work_id),
    CONSTRAINT fk_work_record_items_record FOREIGN KEY (work_record_id) REFERENCES work_records(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_work_record_items_work FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE files (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    file_name       VARCHAR(500) NOT NULL,
    storage_path    VARCHAR(1000) NOT NULL,
    mime_type       VARCHAR(150),
    file_size       BIGINT UNSIGNED,
    file_hash       VARCHAR(128),
    uploaded_by     BIGINT UNSIGNED NOT NULL,
    entity_type     VARCHAR(50),
    entity_id       BIGINT UNSIGNED,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    KEY idx_files_entity (entity_type, entity_id),
    KEY idx_files_hash (file_hash),
    CONSTRAINT fk_files_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE help_documents (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(500) NOT NULL,
    file_id         BIGINT UNSIGNED NULL,
    view_count      INT UNSIGNED NOT NULL DEFAULT 0,
    published_at    DATETIME NOT NULL,
    status          TINYINT NOT NULL DEFAULT 1,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_help_documents_published_at (published_at),
    CONSTRAINT fk_help_documents_file FOREIGN KEY (file_id) REFERENCES files(id) ON DELETE SET NULL ON UPDATE CASCADE
);

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO units
(
    id,
    code,
    name,
    short_name,
    parent_id,
    unit_type,
    status
)
VALUES
(
    1,
    'BNG',
    'Bộ Ngoại giao',
    'BNG',
    NULL,
    'MINISTRY',
    1
),
(
    2,
    'CYTT',
    'Cục Cơ yếu-Công nghệ thông tin',
    'CYTT',
    1,
    'UNIT',
    1
),
(
    3,
    'VP',
    'Văn phòng Bộ',
    'VP',
    1,
    'UNIT',
    1
),
(
    4,
    'SNV',
    'Sở Ngoại vụ thành phố Đà Nẵng',
    'SNV ĐN',
    NULL,
    'EXTERNAL',
    1
),
(
    5,
    'BQP',
    'Bộ Quốc phòng',
    'BQP',
    NULL,
    'EXTERNAL',
    1
);



INSERT INTO departments
(
    id,
    code,
    name,
    unit_id,
    parent_id,
    status
)
VALUES
(
    1,
    'CYTT-NC',
    'Phòng Nghiên cứu',
    2,
    NULL,
    1
),
(
    2,
    'CYTT-TC',
    'Phòng Tổ chức',
    2,
    NULL,
    1
),
(
    3,
    'CYTT-BM',
    'Phòng Bảo mật',
    2,
    NULL,
    1
),
(
    4,
    'VP-TĐKT',
    'Phòng Thi đua - Khen thưởng',
    3,
    NULL,
    1
),
(
    5,
    'VP-VT',
    'Phòng Văn thư',
    3,
    NULL,
    1
);



INSERT INTO users
(
    id,
    username,
    password_hash,
    role,
    full_name,
    email,
    department_id,
    unit_id,
    status,
    last_login_at
)
VALUES
(
    1,
    'luuanhtuan',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Lưu Anh Tuấn',
    'luuanhtuan@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    2,
    'nguyennhutrung',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Nguyễn Như Trung',
    'nguyennhutrung@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    3,
    'kieuviethung',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Kiều Việt Hùng',
    'kieuviethung@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    4,
    'dauvietduc',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Đậu Việt Đức',
    'dauvietduc@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    5,
    'phamtrungdung',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Phạm Trung Dũng',
    'phamtrungdung@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    6,
    'hosyan',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Hồ Sỹ An',
    'hosyan@cytt.gov.vn',
    2,
    2,
    1,
    NULL
),
(
    7,
    'domanhquan',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Đỗ Mạnh Quân',
    'domanhquan@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    8,
    'nguyenthithuhang',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Nguyễn Thị Thu Hằng',
    'nguyenthithuhang@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    9,
    'buihuuviet',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Bùi Hữu Việt',
    'buihuuviet@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    10,
    'maithuygiang',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Mai Thùy Giang',
    'maithuygiang@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    11,
    'phanvannhan',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Phan Văn Nhân',
    'phanvannhan@cytt.gov.vn',
    1,
    2,
    1,
    NULL
),
(
    12,
    'nguyendanglam',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'USER',
    'Nguyễn Đăng Lâm',
    'nguyendanglam@cytt.gov.vn',
    3,
    2,
    1,
    NULL
),
(
    13,
    'admin',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    'Quản trị hệ thống',
    'admin@cytt.gov.vn',
    NULL,
    1,
    1,
    NULL
);



INSERT INTO documents
(
    id,
    document_type,
    incoming_number,
    outgoing_number,
    reference_number,
    subject,
    issue_date,
    received_date,
    issuing_unit_id,
    receiving_unit_id,
    created_by,
    status
)
VALUES
(
    1,
    'INCOMING',
    '4066',
    NULL,
    '2918/VP-TĐKT',
    'V/v góp ý Bộ chỉ tiêu thi đua',
    '2026-08-21',
    '2026-08-21',
    1,
    2,
    11,
    'UNPROCESSED'
),
(
    2,
    'INCOMING',
    '592',
    NULL,
    '4444/QĐ-BQP',
    'Về việc công bố thủ tục hành chính bị bãi bỏ trong lĩnh vực cơ yếu thuộc phạm vi chức năng quản lý của Bộ Quốc phòng',
    '2026-08-19',
    '2026-08-19',
    5,
    2,
    11,
    'COMPLETED'
),
(
    3,
    'INCOMING',
    '4063',
    NULL,
    '62/CYTT-DU',
    'KL của BCH ĐUC CY-CNTT v/v kéo dài nhiệm kỳ đại hội của các chi bộ trực thuộc',
    '2026-08-20',
    '2026-08-20',
    2,
    2,
    1,
    'PROCESSING'
),
(
    4,
    'OUTGOING',
    NULL,
    '1560',
    '1560/CYTT-NC',
    'Về cung cấp thông tin phục vụ CV số 4431/TGV ngày 21/8/2026 của Tổ Giúp việc',
    '2026-08-22',
    NULL,
    2,
    1,
    3,
    'PUBLISHED'
),
(
    5,
    'OUTGOING',
    NULL,
    '1561',
    '1561/CYTT-NC',
    'Công văn gửi Cục NVVH đề nghị cho ý kiến đối với Báo cáo đề xuất chủ trương đầu tư Dự án nâng cấp phần mềm Cơ sở dữ liệu chuyên ngành Ngoại vụ',
    '2026-08-22',
    NULL,
    2,
    4,
    5,
    'PUBLISHED'
),
(
    6,
    'OUTGOING',
    NULL,
    '1557',
    '1557/CYTT-BM',
    'Chia sẻ thông tin giám sát an ninh mạng về Trung tâm An ninh mạng quốc gia',
    '2026-08-21',
    NULL,
    2,
    1,
    12,
    'PUBLISHED'
);



INSERT INTO incoming_documents
(
    id,
    document_id,
    incoming_number,
    received_date,
    receipt_type,
    response_required,
    status,
    receiving_unit_id
)
VALUES
(
    1,
    1,
    '4066',
    '2026-08-21',
    'INTERNAL',
    1,
    'UNPROCESSED',
    2
),
(
    2,
    2,
    '592',
    '2026-08-19',
    'EXTERNAL',
    0,
    'COMPLETED',
    2
),
(
    3,
    3,
    '4063',
    '2026-08-20',
    'INTERNAL',
    0,
    'PROCESSING',
    2
);



INSERT INTO incoming_assignments
(
    id,
    incoming_document_id,
    assigned_by,
    lead_user_id,
    lead_unit_id,
    assigned_at,
    due_at,
    work_type,
    notification_type,
    status,
    return_reason
)
VALUES
(
    1,
    1,
    11,
    10,
    2,
    '2026-08-21 09:00:00',
    '2026-08-28 17:00:00',
    'RESPONSE_REQUIRED',
    'NEAR_DEADLINE',
    'UNPROCESSED',
    NULL
),
(
    2,
    2,
    11,
    8,
    2,
    '2026-08-19 09:00:00',
    NULL,
    'NO_RESPONSE_REQUIRED',
    NULL,
    'COMPLETED',
    NULL
),
(
    3,
    3,
    1,
    6,
    2,
    '2026-08-20 14:00:00',
    '2026-08-27 17:00:00',
    'NO_RESPONSE_REQUIRED',
    'NEAR_DEADLINE',
    'PROCESSING',
    NULL
);



INSERT INTO incoming_collaborators
(
    assignment_id,
    user_id,
    unit_id,
    assigned_at,
    status
)
VALUES
(
    1,
    8,
    NULL,
    '2026-08-21 09:00:00',
    'PROCESSING'
),
(
    1,
    9,
    NULL,
    '2026-08-21 09:00:00',
    'PROCESSING'
),
(
    3,
    8,
    NULL,
    '2026-08-20 14:00:00',
    'PROCESSING'
),
(
    3,
    NULL,
    3,
    '2026-08-20 14:00:00',
    'PROCESSING'
);



INSERT INTO incoming_processing_history
(
    id,
    incoming_document_id,
    processed_by,
    action,
    old_status,
    new_status,
    content,
    created_at
)
VALUES
(
    1,
    1,
    11,
    'RECEIVED',
    NULL,
    'UNPROCESSED',
    'Tiếp nhận văn bản đến số 4066.',
    '2026-08-21 08:30:00'
),
(
    2,
    1,
    11,
    'ASSIGNED',
    'UNPROCESSED',
    'UNPROCESSED',
    'Phân công đồng chí Mai Thùy Giang chủ trì xử lý.',
    '2026-08-21 09:00:00'
),
(
    3,
    2,
    11,
    'RECEIVED',
    NULL,
    'UNPROCESSED',
    'Tiếp nhận văn bản đến số 592.',
    '2026-08-19 08:30:00'
),
(
    4,
    2,
    8,
    'COMPLETED',
    'PROCESSING',
    'COMPLETED',
    'Đã kiểm tra, xử lý và hoàn tất.',
    '2026-08-20 16:30:00'
),
(
    5,
    3,
    1,
    'RECEIVED',
    NULL,
    'UNPROCESSED',
    'Tiếp nhận văn bản đến số 4063.',
    '2026-08-20 08:20:00'
),
(
    6,
    3,
    6,
    'PROCESSING',
    'UNPROCESSED',
    'PROCESSING',
    'Đang xử lý nội dung văn bản.',
    '2026-08-20 14:00:00'
);



INSERT INTO frequent_groups
(
    id,
    name,
    short_name,
    document_classification,
    group_type,
    description,
    status,
    created_by
)
VALUES
(
    1,
    'Đơn vị nội bộ hay dùng',
    'NB',
    'INTERNAL',
    'UNIT',
    'Nhóm đơn vị dùng thường xuyên trong xử lý văn bản nội bộ.',
    1,
    1
),
(
    2,
    'Các phòng thuộc Cục CY-CNTT',
    'CYTT-P',
    'INTERNAL',
    'DEPARTMENT',
    'Nhóm các phòng thuộc Cục Cơ yếu-Công nghệ thông tin.',
    1,
    1
),
(
    3,
    'Cán bộ xử lý văn bản',
    'CBXL',
    'INTERNAL',
    'USER',
    'Nhóm cán bộ thường xuyên tham gia xử lý văn bản.',
    1,
    13
);



INSERT INTO group_members
(
    id,
    group_id,
    user_id,
    department_id,
    unit_id
)
VALUES
(
    1,
    1,
    NULL,
    NULL,
    1
),
(
    2,
    1,
    NULL,
    NULL,
    2
),
(
    3,
    2,
    NULL,
    1,
    NULL
),
(
    4,
    2,
    NULL,
    2,
    NULL
),
(
    5,
    2,
    NULL,
    3,
    NULL
),
(
    6,
    3,
    8,
    NULL,
    NULL
),
(
    7,
    3,
    9,
    NULL,
    NULL
),
(
    8,
    3,
    10,
    NULL,
    NULL
),
(
    9,
    3,
    12,
    NULL,
    NULL
);



INSERT INTO submissions
(
    id,
    document_id,
    submission_number,
    subject,
    drafted_by,
    submitted_at,
    department_id,
    target,
    status,
    published_at
)
VALUES
(
    1,
    4,
    '150/TTr-CYTT',
    'V/v cho ý kiến dự thảo Kế hoạch triển khai thực hiện Đề án khuyến khích xã hội hoá hoạt động nghiên cứu, phát triển ứng dụng mật mã dân sự.',
    1,
    '2026-08-20',
    1,
    'Lãnh đạo Bộ',
    'PUBLISHED',
    '2026-08-20 16:00:00'
),
(
    2,
    5,
    '146/TTr-CYTT',
    'Về việc ban hành Danh sách và dự toán kinh phí cán bộ được hưởng mức hỗ trợ đối với người làm công tác chuyên trách về chuyển đổi số, an toàn thông tin mạng, an ninh mạng theo Nghị định số 179/2025/NĐ-CP của Chính phủ.',
    6,
    '2026-08-19',
    2,
    'Lãnh đạo Bộ',
    'PUBLISHED',
    '2026-08-19 15:30:00'
),
(
    3,
    NULL,
    '0/TTr-CYTT',
    'V/v báo cáo tổng kết việc thi hành Thông tư số 11/2015/TT-BKHCN và Thông tư liên tịch số 14/2016/TTLT-BTTTT-BKHCN',
    7,
    '2026-08-23',
    1,
    'Văn phòng Bộ',
    'SUSPENDED',
    NULL
),
(
    4,
    NULL,
    '151/TTr-CYTT',
    'V/v đề nghị phê duyệt kế hoạch triển khai nhiệm vụ chuyển đổi số năm 2026.',
    3,
    '2026-08-24',
    1,
    'Lãnh đạo đơn vị',
    'SUBMITTING_UNIT_LEADER',
    NULL
),
(
    5,
    NULL,
    '152/TTr-CYTT',
    'V/v xin ý kiến các đơn vị về dự thảo quy chế quản lý và khai thác hệ thống.',
    5,
    '2026-08-24',
    3,
    'Các đơn vị liên quan',
    'REQUESTING_OPINION',
    NULL
);



INSERT INTO submission_comments
(
    id,
    submission_id,
    requested_from_user_id,
    requested_from_unit_id,
    content,
    sent_at,
    due_at,
    replied_at,
    status
)
VALUES
(
    1,
    1,
    2,
    NULL,
    'Đề nghị cho ý kiến đối với nội dung kế hoạch trước khi trình Lãnh đạo Bộ.',
    '2026-08-20 09:00:00',
    '2026-08-20 15:00:00',
    '2026-08-20 11:30:00',
    'REPLIED'
),
(
    2,
    2,
    NULL,
    3,
    'Đề nghị Văn phòng Bộ phối hợp rà soát nội dung dự toán.',
    '2026-08-19 10:00:00',
    '2026-08-20 10:00:00',
    '2026-08-19 16:00:00',
    'REPLIED'
),
(
    3,
    5,
    12,
    NULL,
    'Xin ý kiến về tính khả thi của phương án triển khai.',
    '2026-08-24 09:00:00',
    '2026-08-26 17:00:00',
    NULL,
    'WAITING'
);



INSERT INTO submission_history
(
    id,
    submission_id,
    performed_by,
    old_status,
    new_status,
    action,
    content,
    created_at
)
VALUES
(
    1,
    1,
    1,
    NULL,
    'DRAFTING',
    'CREATE',
    'Tạo văn bản trình.',
    '2026-08-20 08:30:00'
),
(
    2,
    1,
    1,
    'DRAFTING',
    'REQUESTING_OPINION',
    'REQUEST_OPINION',
    'Xin ý kiến các đơn vị liên quan.',
    '2026-08-20 09:00:00'
),
(
    3,
    1,
    2,
    'REQUESTING_OPINION',
    'APPROVED',
    'APPROVE',
    'Đã cho ý kiến thống nhất.',
    '2026-08-20 13:00:00'
),
(
    4,
    1,
    13,
    'APPROVED',
    'PUBLISHED',
    'PUBLISH',
    'Đã phát hành văn bản trình.',
    '2026-08-20 16:00:00'
),
(
    5,
    3,
    7,
    NULL,
    'DRAFTING',
    'CREATE',
    'Tạo văn bản trình.',
    '2026-08-23 08:30:00'
),
(
    6,
    3,
    7,
    'DRAFTING',
    'SUSPENDED',
    'SUSPEND',
    'Tạm dừng để bổ sung hồ sơ.',
    '2026-08-23 15:00:00'
),
(
    7,
    5,
    5,
    NULL,
    'DRAFTING',
    'CREATE',
    'Tạo văn bản trình.',
    '2026-08-24 08:00:00'
),
(
    8,
    5,
    5,
    'DRAFTING',
    'REQUESTING_OPINION',
    'REQUEST_OPINION',
    'Gửi xin ý kiến.',
    '2026-08-24 09:00:00'
);



INSERT INTO draft_documents
(
    id,
    document_id,
    drafted_by,
    approving_leader_id,
    submitted_at,
    subject,
    status
)
VALUES
(
    1,
    NULL,
    4,
    2,
    '2026-08-24',
    'Ý kiến chỉ đạo và kết luận của Lãnh đạo Bộ tại cuộc họp về CĐS ngày 22/8 - định kỳ lần thứ 10',
    'PUBLISHED'
),
(
    2,
    NULL,
    3,
    2,
    '2026-08-22',
    'Về cung cấp thông tin phục vụ CV số 4431/TGV ngày 21/8/2026 của Tổ Giúp việc',
    'PUBLISHED'
),
(
    3,
    NULL,
    5,
    2,
    '2026-08-22',
    'Công văn gửi Cục NVVH đề nghị cho ý kiến đối với Báo cáo đề xuất chủ trương đầu tư Dự án nâng cấp phần mềm Cơ sở dữ liệu chuyên ngành Ngoại vụ phục vụ công tác chỉ đạo, điều hành đơn vị của SNV thành phố Đà Nẵng.',
    'PUBLISHED'
),
(
    4,
    NULL,
    8,
    2,
    '2026-08-24',
    'Dự thảo kế hoạch nâng cấp hệ thống quản lý văn bản và điều hành.',
    'REQUESTING_OPINION'
),
(
    5,
    NULL,
    9,
    2,
    '2026-08-24',
    'Dự thảo quy chế quản lý tài khoản và phân quyền người dùng.',
    'DRAFTING'
);



INSERT INTO draft_comments
(
    id,
    draft_document_id,
    reviewer_id,
    content,
    sent_at,
    replied_at,
    status
)
VALUES
(
    1,
    1,
    2,
    'Nội dung cơ bản phù hợp, đề nghị bổ sung thời gian thực hiện.',
    '2026-08-24 09:00:00',
    '2026-08-24 10:30:00',
    'REPLIED'
),
(
    2,
    2,
    6,
    'Đề nghị rà soát lại số liệu tại phụ lục.',
    '2026-08-22 09:30:00',
    '2026-08-22 14:00:00',
    'REPLIED'
),
(
    3,
    4,
    10,
    'Đề nghị bổ sung nội dung về phân quyền quản trị.',
    '2026-08-24 10:00:00',
    NULL,
    'WAITING'
);



INSERT INTO draft_history
(
    id,
    draft_document_id,
    performed_by,
    old_status,
    new_status,
    action,
    content,
    created_at
)
VALUES
(
    1,
    1,
    4,
    NULL,
    'DRAFTING',
    'CREATE',
    'Tạo dự thảo.',
    '2026-08-24 08:00:00'
),
(
    2,
    1,
    4,
    'DRAFTING',
    'REQUESTING_OPINION',
    'REQUEST_OPINION',
    'Gửi xin ý kiến.',
    '2026-08-24 09:00:00'
),
(
    3,
    1,
    2,
    'REQUESTING_OPINION',
    'APPROVED',
    'APPROVE',
    'Lãnh đạo phê duyệt.',
    '2026-08-24 11:00:00'
),
(
    4,
    1,
    2,
    'APPROVED',
    'PUBLISHED',
    'PUBLISH',
    'Phát hành.',
    '2026-08-24 14:00:00'
),
(
    5,
    4,
    8,
    NULL,
    'DRAFTING',
    'CREATE',
    'Tạo dự thảo.',
    '2026-08-24 08:30:00'
),
(
    6,
    4,
    8,
    'DRAFTING',
    'REQUESTING_OPINION',
    'REQUEST_OPINION',
    'Gửi xin ý kiến.',
    '2026-08-24 10:00:00'
),
(
    7,
    5,
    9,
    NULL,
    'DRAFTING',
    'CREATE',
    'Tạo dự thảo.',
    '2026-08-24 09:00:00'
);



INSERT INTO outgoing_documents
(
    id,
    document_id,
    outgoing_number,
    reference_number,
    issue_date,
    subject,
    drafted_by,
    signed_by,
    status
)
VALUES
(
    1,
    4,
    '1560',
    '1560/CYTT-NC',
    '2026-08-22',
    'Về cung cấp thông tin phục vụ CV số 4431/TGV ngày 21/8/2026 của Tổ Giúp việc',
    3,
    2,
    'PUBLISHED'
),
(
    2,
    5,
    '1561',
    '1561/CYTT-NC',
    '2026-08-22',
    'Công văn gửi Cục NVVH đề nghị cho ý kiến đối với Báo cáo đề xuất chủ trương đầu tư Dự án nâng cấp phần mềm Cơ sở dữ liệu chuyên ngành Ngoại vụ phục vụ công tác chỉ đạo, điều hành đơn vị của SNV thành phố Đà Nẵng.',
    5,
    2,
    'PUBLISHED'
),
(
    3,
    6,
    '1557',
    '1557/CYTT-BM',
    '2026-08-21',
    'Chia sẻ thông tin giám sát an ninh mạng về Trung tâm An ninh mạng quốc gia',
    12,
    12,
    'PUBLISHED'
),
(
    4,
    NULL,
    '1562',
    '1562/CYTT-TC',
    '2026-08-24',
    'Về việc đề nghị phối hợp cung cấp số liệu phục vụ báo cáo công tác quý III.',
    6,
    2,
    'DRAFTING'
),
(
    5,
    NULL,
    NULL,
    NULL,
    '2026-08-24',
    'Dự thảo công văn về triển khai nhiệm vụ bảo đảm an toàn thông tin.',
    12,
    12,
    'SUSPENDED'
);



INSERT INTO outgoing_recipients
(
    id,
    outgoing_document_id,
    unit_id,
    department_id,
    user_id,
    group_id,
    recipient_type,
    delivery_status,
    sent_at
)
VALUES
(
    1,
    1,
    1,
    NULL,
    NULL,
    NULL,
    'UNIT',
    'SENT',
    '2026-08-22 00:00:00'
),
(
    2,
    1,
    3,
    NULL,
    NULL,
    NULL,
    'UNIT',
    'SENT',
    '2026-08-22 00:00:00'
),
(
    3,
    2,
    4,
    NULL,
    NULL,
    NULL,
    'UNIT',
    'SENT',
    '2026-08-22 00:00:00'
),
(
    4,
    2,
    NULL,
    1,
    NULL,
    NULL,
    'DEPARTMENT',
    'SENT',
    '2026-08-22 00:00:00'
),
(
    5,
    3,
    NULL,
    NULL,
    8,
    NULL,
    'USER',
    'SENT',
    '2026-08-21 16:00:00'
),
(
    6,
    3,
    NULL,
    NULL,
    9,
    NULL,
    'USER',
    'SENT',
    '2026-08-21 16:00:00'
),
(
    7,
    4,
    NULL,
    2,
    NULL,
    NULL,
    'DEPARTMENT',
    'PENDING',
    NULL
),
(
    8,
    5,
    NULL,
    NULL,
    NULL,
    1,
    'GROUP',
    'PENDING',
    NULL
);



INSERT INTO work_records
(
    id,
    name,
    assigned_at,
    due_at,
    created_by,
    status,
    description
)
VALUES
(
    1,
    'Hồ sơ công việc chuyển đổi số',
    '2026-08-21 09:00:00',
    '2026-08-30 17:00:00',
    1,
    'PROCESSING',
    'Hồ sơ tập hợp các công việc liên quan đến triển khai nhiệm vụ chuyển đổi số.'
),
(
    2,
    'Hồ sơ xử lý văn bản đến tháng 08/2026',
    '2026-08-19 09:00:00',
    '2026-08-31 17:00:00',
    11,
    'PROCESSING',
    'Hồ sơ theo dõi và xử lý các văn bản đến trong tháng 08/2026.'
),
(
    3,
    'Hồ sơ công việc đã hoàn thành',
    '2026-08-01 08:00:00',
    '2026-08-20 17:00:00',
    6,
    'COMPLETED',
    'Hồ sơ công việc đã hoàn thành.'
);



INSERT INTO works
(
    id,
    name,
    incoming_document_id,
    work_record_id,
    assigned_by,
    assigned_at,
    due_at,
    work_type,
    notification_type,
    status,
    description
)
VALUES
(
    1,
    'Góp ý Bộ chỉ tiêu thi đua',
    1,
    1,
    11,
    '2026-08-21 09:00:00',
    '2026-08-28 17:00:00',
    'RESPONSE_REQUIRED',
    'NEAR_DEADLINE',
    'UNPROCESSED',
    'Nghiên cứu và tổng hợp ý kiến góp ý Bộ chỉ tiêu thi đua.'
),
(
    2,
    'Rà soát thủ tục hành chính lĩnh vực cơ yếu',
    2,
    2,
    11,
    '2026-08-19 09:00:00',
    '2026-08-25 17:00:00',
    'NO_RESPONSE_REQUIRED',
    NULL,
    'COMPLETED',
    'Rà soát nội dung văn bản và báo cáo kết quả.'
),
(
    3,
    'Theo dõi kết luận BCH ĐUC CY-CNTT',
    3,
    2,
    1,
    '2026-08-20 14:00:00',
    '2026-08-27 17:00:00',
    'NO_RESPONSE_REQUIRED',
    'NEAR_DEADLINE',
    'PROCESSING',
    'Theo dõi và tổng hợp việc thực hiện kết luận.'
),
(
    4,
    'Tổng hợp báo cáo chuyển đổi số',
    NULL,
    1,
    6,
    '2026-08-24 08:00:00',
    '2026-08-29 17:00:00',
    'RESPONSE_REQUIRED',
    'NEAR_DEADLINE',
    'PROCESSING',
    'Tổng hợp số liệu phục vụ báo cáo.'
),
(
    5,
    'Hoàn thiện hồ sơ báo cáo quý II',
    NULL,
    3,
    6,
    '2026-08-01 08:00:00',
    '2026-08-20 17:00:00',
    'NO_RESPONSE_REQUIRED',
    NULL,
    'COMPLETED',
    'Hoàn thiện và lưu hồ sơ báo cáo quý II.'
);



INSERT INTO work_assignees
(
    id,
    work_id,
    user_id,
    unit_id
)
VALUES
(
    1,
    1,
    10,
    NULL
),
(
    2,
    2,
    8,
    NULL
),
(
    3,
    3,
    6,
    NULL
),
(
    4,
    4,
    7,
    NULL
),
(
    5,
    5,
    6,
    NULL
),
(
    6,
    4,
    NULL,
    2
);



INSERT INTO work_collaborators
(
    id,
    work_id,
    user_id,
    unit_id
)
VALUES
(
    1,
    1,
    8,
    NULL
),
(
    2,
    1,
    9,
    NULL
),
(
    3,
    2,
    10,
    NULL
),
(
    4,
    3,
    8,
    NULL
),
(
    5,
    3,
    9,
    NULL
),
(
    6,
    4,
    NULL,
    3
);



INSERT INTO work_history
(
    id,
    work_id,
    performed_by,
    old_status,
    new_status,
    action,
    content,
    created_at
)
VALUES
(
    1,
    1,
    11,
    NULL,
    'UNPROCESSED',
    'ASSIGN',
    'Phân công công việc cho đồng chí Mai Thùy Giang.',
    '2026-08-21 09:00:00'
),
(
    2,
    2,
    11,
    NULL,
    'PROCESSING',
    'ASSIGN',
    'Phân công xử lý văn bản.',
    '2026-08-19 09:00:00'
),
(
    3,
    2,
    8,
    'PROCESSING',
    'COMPLETED',
    'COMPLETE',
    'Đã hoàn thành xử lý.',
    '2026-08-20 16:30:00'
),
(
    4,
    3,
    1,
    NULL,
    'PROCESSING',
    'ASSIGN',
    'Phân công theo dõi kết luận.',
    '2026-08-20 14:00:00'
),
(
    5,
    4,
    6,
    NULL,
    'PROCESSING',
    'ASSIGN',
    'Giao tổng hợp báo cáo chuyển đổi số.',
    '2026-08-24 08:00:00'
),
(
    6,
    5,
    6,
    NULL,
    'PROCESSING',
    'ASSIGN',
    'Tạo công việc hoàn thiện hồ sơ.',
    '2026-08-01 08:00:00'
),
(
    7,
    5,
    6,
    'PROCESSING',
    'COMPLETED',
    'COMPLETE',
    'Đã hoàn thành.',
    '2026-08-20 16:00:00'
);



INSERT INTO work_record_members
(
    id,
    work_record_id,
    user_id,
    unit_id,
    role
)
VALUES
(
    1,
    1,
    1,
    NULL,
    'OWNER'
),
(
    2,
    1,
    8,
    NULL,
    'COLLABORATOR'
),
(
    3,
    1,
    9,
    NULL,
    'FOLLOWER'
),
(
    4,
    2,
    11,
    NULL,
    'OWNER'
),
(
    5,
    2,
    6,
    NULL,
    'COLLABORATOR'
),
(
    6,
    2,
    8,
    NULL,
    'FOLLOWER'
),
(
    7,
    3,
    6,
    NULL,
    'OWNER'
),
(
    8,
    3,
    12,
    NULL,
    'COLLABORATOR'
);



INSERT INTO work_record_items
(
    id,
    work_record_id,
    work_id
)
VALUES
(
    1,
    1,
    1
),
(
    2,
    1,
    4
),
(
    3,
    2,
    2
),
(
    4,
    2,
    3
),
(
    5,
    3,
    5
);



INSERT INTO files
(
    id,
    file_name,
    storage_path,
    mime_type,
    file_size,
    file_hash,
    uploaded_by,
    entity_type,
    entity_id
)
VALUES
(
    1,
    'huong-dan-van-thu-tu-choi-phe-duyet.pdf',
    '/uploads/help/huong-dan-van-thu-tu-choi-phe-duyet.pdf',
    'application/pdf',
    245760,
    'dev-hash-help-001',
    13,
    'HELP_DOCUMENT',
    1
),
(
    2,
    'huong-dan-phat-hanh-van-ban-khi-su-co-mang.pdf',
    '/uploads/help/huong-dan-phat-hanh-van-ban-khi-su-co-mang.pdf',
    'application/pdf',
    327680,
    'dev-hash-help-002',
    13,
    'HELP_DOCUMENT',
    2
),
(
    3,
    'huong-dan-cap-nhat-thay-the-thu-hoi.pdf',
    '/uploads/help/huong-dan-cap-nhat-thay-the-thu-hoi.pdf',
    'application/pdf',
    512000,
    'dev-hash-help-003',
    13,
    'HELP_DOCUMENT',
    3
),
(
    4,
    'cong-van-1560.pdf',
    '/uploads/outgoing/2026/08/cong-van-1560.pdf',
    'application/pdf',
    188416,
    'dev-hash-outgoing-1560',
    3,
    'OUTGOING_DOCUMENT',
    1
),
(
    5,
    'cong-van-1561.pdf',
    '/uploads/outgoing/2026/08/cong-van-1561.pdf',
    'application/pdf',
    204800,
    'dev-hash-outgoing-1561',
    5,
    'OUTGOING_DOCUMENT',
    2
);



INSERT INTO help_documents
(
    id,
    name,
    file_id,
    view_count,
    published_at,
    status
)
VALUES
(
    1,
    'Hướng dẫn văn thư các đơn vị gửi lại văn bản bị từ chối phê duyệt (Văn thư các đơn vị)',
    1,
    34,
    '2026-04-17 14:39:42',
    1
),
(
    2,
    'Hướng dẫn văn thư các đơn vị đại diện phát hành văn bản đi khi gặp sự cố mạng',
    2,
    80,
    '2025-09-10 08:42:26',
    1
),
(
    3,
    'Hướng dẫn sử dụng Cập nhật, thay thế, thu hồi, lấy lại, tạm dừng văn bản đi',
    3,
    218,
    '2025-07-29 15:13:49',
    1
),
(
    4,
    'Hướng dẫn xử lý văn bản đến và phân công công việc',
    NULL,
    15,
    '2026-08-01 08:00:00',
    1
),
(
    5,
    'Hướng dẫn tạo và xử lý văn bản trình',
    NULL,
    22,
    '2026-08-05 09:15:00',
    1
);



SELECT
    id,
    username,
    full_name,
    role,
    department_id,
    unit_id,
    status
FROM users
ORDER BY id;


SELECT
    'units' AS table_name,
    COUNT(*) AS total
FROM units

UNION ALL

SELECT
    'departments',
    COUNT(*)
FROM departments

UNION ALL

SELECT
    'users',
    COUNT(*)
FROM users

UNION ALL

SELECT
    'documents',
    COUNT(*)
FROM documents

UNION ALL

SELECT
    'incoming_documents',
    COUNT(*)
FROM incoming_documents

UNION ALL

SELECT
    'incoming_assignments',
    COUNT(*)
FROM incoming_assignments

UNION ALL

SELECT
    'incoming_collaborators',
    COUNT(*)
FROM incoming_collaborators

UNION ALL

SELECT
    'incoming_processing_history',
    COUNT(*)
FROM incoming_processing_history

UNION ALL

SELECT
    'frequent_groups',
    COUNT(*)
FROM frequent_groups

UNION ALL

SELECT
    'group_members',
    COUNT(*)
FROM group_members

UNION ALL

SELECT
    'submissions',
    COUNT(*)
FROM submissions

UNION ALL

SELECT
    'submission_comments',
    COUNT(*)
FROM submission_comments

UNION ALL

SELECT
    'submission_history',
    COUNT(*)
FROM submission_history

UNION ALL

SELECT
    'draft_documents',
    COUNT(*)
FROM draft_documents

UNION ALL

SELECT
    'draft_comments',
    COUNT(*)
FROM draft_comments

UNION ALL

SELECT
    'draft_history',
    COUNT(*)
FROM draft_history

UNION ALL

SELECT
    'outgoing_documents',
    COUNT(*)
FROM outgoing_documents

UNION ALL

SELECT
    'outgoing_recipients',
    COUNT(*)
FROM outgoing_recipients

UNION ALL

SELECT
    'work_records',
    COUNT(*)
FROM work_records

UNION ALL

SELECT
    'works',
    COUNT(*)
FROM works

UNION ALL

SELECT
    'work_assignees',
    COUNT(*)
FROM work_assignees

UNION ALL

SELECT
    'work_collaborators',
    COUNT(*)
FROM work_collaborators

UNION ALL

SELECT
    'work_history',
    COUNT(*)
FROM work_history

UNION ALL

SELECT
    'work_record_members',
    COUNT(*)
FROM work_record_members

UNION ALL

SELECT
    'work_record_items',
    COUNT(*)
FROM work_record_items

UNION ALL

SELECT
    'files',
    COUNT(*)
FROM files

UNION ALL

SELECT
    'help_documents',
    COUNT(*)
FROM help_documents;


SELECT
    COUNT(*) AS total_tables
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_type = 'BASE TABLE';