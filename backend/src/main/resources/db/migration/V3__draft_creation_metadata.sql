CREATE TABLE document_types (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code        VARCHAR(50) NOT NULL,
    name        VARCHAR(255) NOT NULL,
    status      TINYINT NOT NULL DEFAULT 1,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_document_types_code (code)
);

ALTER TABLE draft_documents
    ADD COLUMN document_type_id BIGINT UNSIGNED NULL,
    ADD KEY idx_drafts_document_type (document_type_id),
    ADD CONSTRAINT fk_drafts_document_type
        FOREIGN KEY (document_type_id) REFERENCES document_types(id)
        ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE draft_recipients (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    draft_document_id   BIGINT UNSIGNED NOT NULL,
    user_id             BIGINT UNSIGNED NOT NULL,
    recipient_type      VARCHAR(20) NOT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_draft_recipients (draft_document_id, user_id),
    KEY idx_draft_recipients_draft (draft_document_id),
    CONSTRAINT fk_draft_recipients_draft FOREIGN KEY (draft_document_id)
        REFERENCES draft_documents(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_draft_recipients_user FOREIGN KEY (user_id)
        REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO document_types (code, name, status) VALUES
    ('CONG_VAN', 'Công văn', 1),
    ('CONG_DIEN', 'Công điện', 1),
    ('CONG_HAM', 'Công hàm', 1),
    ('TO_TRINH', 'Tờ trình', 1),
    ('BAO_CAO', 'Báo cáo', 1),
    ('KET_LUAN', 'Kết luận', 1),
    ('QUYET_DINH', 'Quyết định', 1),
    ('GIAY_MOI', 'Giấy mời', 1),
    ('QUY_DINH', 'Quy định', 1),
    ('THONG_BAO', 'Thông báo', 1),
    ('DE_AN', 'Đề án', 1),
    ('XIN_Y_KIEN_NOI_BO', 'Xin ý kiến nội bộ', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

INSERT INTO departments (code, name, unit_id, parent_id, status) VALUES
    ('CYTT-LD', 'Lãnh đạo đơn vị', 2, NULL, 1),
    ('CYTT-QLHT', 'Phòng Quản lý hệ thống', 2, NULL, 1),
    ('CYTT-NCUD', 'Phòng Nghiên cứu ứng dụng', 2, NULL, 1),
    ('CYTT-QLKT', 'Phòng Quản lý kỹ thuật', 2, NULL, 1),
    ('CYTT-TCH', 'Phòng Tổ chức - Tổng hợp', 2, NULL, 1),
    ('CYTT-MDTT', 'Phòng Mã dịch - Truyền thông', 2, NULL, 1),
    ('CYTT-ATBM', 'Phòng Bảo mật và An toàn', 2, NULL, 1),
    ('CYTT-DB', 'Phòng Điện báo', 2, NULL, 1),
    ('CYTT-CDTN', 'Chi đoàn thanh niên', 2, NULL, 1),
    ('CYTT-BDS', 'Ban Đời sống', 2, NULL, 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), status = VALUES(status);

INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'vutiendung', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Vũ Tiến Dũng', 'vutiendung@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-LD'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'domaithanh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Đỗ Mai Thanh', 'domaithanh@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-QLHT'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'nguyenvanhai', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Nguyễn Văn Hải', 'nguyenvanhai@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-NCUD'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'tranminhkhoa', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Trần Minh Khoa', 'tranminhkhoa@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-QLKT'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'lethiminh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Lê Thị Minh', 'lethiminh@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-TCH'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'phamhuyhoang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Phạm Huy Hoàng', 'phamhuyhoang@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-MDTT'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'ngocanh', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Ngọc Anh', 'ngocanh@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-ATBM'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'buithuhoai', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Bùi Thu Hoài', 'buithuhoai@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-DB'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'lehoangnam', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Lê Hoàng Nam', 'lehoangnam@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-CDTN'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
INSERT INTO users (username, password_hash, role, full_name, email, department_id, unit_id, status)
SELECT 'trandieuhuong', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER', 'Trần Diệu Hương', 'trandieuhuong@cytt.gov.vn', id, 2, 1 FROM departments WHERE code = 'CYTT-BDS'
ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), department_id = VALUES(department_id), unit_id = VALUES(unit_id), status = VALUES(status);
