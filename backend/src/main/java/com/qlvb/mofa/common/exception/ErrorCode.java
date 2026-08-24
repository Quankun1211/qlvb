package com.qlvb.mofa.common.exception;

import lombok.Getter;

@Getter
public enum ErrorCode {
    INVALID_CREDENTIALS(401, "Tên đăng nhập hoặc mật khẩu không đúng"),
    UNAUTHORIZED(401, "Chưa xác thực"),
    FORBIDDEN(403, "Không có quyền truy cập"),

    USER_NOT_FOUND(404, "Không tìm thấy người dùng"),
    AGENT_NOT_FOUND(404, "Không tìm thấy doanh nghiệp"),
    CONVERSATION_NOT_FOUND(404, "Không tìm thấy hội thoại"),
    MESSAGE_NOT_FOUND(404, "Không tìm thấy tin nhắn"),
    FAQ_NOT_FOUND(404, "Không tìm thấy FAQ"),
    PRODUCT_NOT_FOUND(404, "Không tìm thấy sản phẩm"),
    INVENTORY_NOT_FOUND(404, "Không tìm thấy tồn kho"),
    HANDOFF_NOT_FOUND(404, "Không tìm thấy phiên handoff"),
    CHANNEL_ACCOUNT_NOT_FOUND(404, "Không tìm thấy kênh kết nối"),
    KNOWLEDGE_BASE_NOT_FOUND(404, "Không tìm thấy bài viết trong cơ sở tri thức"),

    // Business
    CONVERSATION_ALREADY_CLOSED(400, "Hội thoại đã đóng"),
    HANDOFF_ALREADY_ACTIVE(400, "Đã có phiên handoff đang mở"),
    INVALID_META_SIGNATURE(400, "Chữ ký Meta không hợp lệ"),

    // Generic
    VALIDATION_FAILED(400, "Dữ liệu không hợp lệ"),
    INTERNAL_SERVER_ERROR(500, "Lỗi máy chủ nội bộ"),

    // Duplicate
    DUPLICATE_ERROR(400, "Thông tin đã được tìm thấy"),

    // Order
    ORDER_NOT_FOUND(400, "Không tìm thấy đơn hàng"),
    ORDER_ITEM_NOT_FOUND(400, "Không tìm thấy sản phẩm của đơn hàng");
    private final int httpStatus;
    private final String message;

    ErrorCode(int httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
