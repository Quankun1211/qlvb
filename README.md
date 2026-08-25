# QLVB MOFA – API Documentation

Tài liệu này mô tả các API Controller hiện có trong source code được cung cấp.

> **Base URL:** `http://localhost:8080`  
> **Content-Type:** `application/json` khi gửi request body.  
> Các API có `Authentication`/`SecurityUtils` yêu cầu người dùng đã đăng nhập/xác thực.

---

## 1. Authentication

### Đăng nhập

**POST** `/api/auth/login`

Request body: `LoginRequest`

```json
{
  "username": "string",
  "password": "string"
}
```

Response: `LoginResponse`

```http
HTTP 200 OK
```

Controller gọi `authService.login(request)`.

---

# 2. Draft Documents – Văn bản dự thảo

Base path:

```text
/api/draft-documents
```

### 2.1. Lấy tất cả văn bản dự thảo

**GET** `/api/draft-documents/all`

Query parameters:

- Các trường của `DraftSearchRequest`
- `page`: số trang (Spring Data, mặc định 0)
- `size`: số bản ghi/trang (mặc định 20)
- `sort`: trường sắp xếp; mặc định `submittedAt,DESC`

Response:

```text
Page<DraftDocumentResponse>
```

### 2.2. Lấy văn bản đang dự thảo hoặc xin ý kiến

**GET** `/api/draft-documents/drafting-or-opinion`

Query parameters:

- Các trường của `DraftSearchRequest`
- `page`
- `size`
- `sort` – mặc định `submittedAt,DESC`

Response:

```text
Page<DraftDocumentResponse>
```

### 2.3. Lấy văn bản đã phê duyệt

**GET** `/api/draft-documents/approved`

Query parameters:

- Các trường của `DraftSearchRequest`
- `page`
- `size`
- `sort` – mặc định `submittedAt,DESC`

Response:

```text
Page<DraftDocumentResponse>
```

### 2.4. Lấy văn bản bị tạm dừng

**GET** `/api/draft-documents/suspended`

Query parameters:

- Các trường của `DraftSearchRequest`
- `page`
- `size`
- `sort` – mặc định `submittedAt,DESC`

Response:

```text
Page<DraftDocumentResponse>
```

---

# 3. Frequent Groups – Nhóm thường xuyên

Base path:

```text
/api/frequent-groups
```

### 3.1. Tạo nhóm thường xuyên

**POST** `/api/frequent-groups`

Authentication: **Có**

Request body: `CreateFrequentGroupRequest`

```json
{
  "...": "..."
}
```

> Các field cụ thể phụ thuộc vào `CreateFrequentGroupRequest`.

Response:

```text
FrequentGroupResponse
```

HTTP status:

```text
201 CREATED
```

Username được lấy từ `Authentication.getName()` và truyền vào service.

### 3.2. Danh sách nhóm thường xuyên

**GET** `/api/frequent-groups`

Query parameters:

- Các trường của `FrequentGroupSearchRequest`
- `page`
- `size` – mặc định 20
- `sort` – mặc định `createdAt,DESC`

Response:

```text
Page<FrequentGroupResponse>
```

### 3.3. Chi tiết nhóm thường xuyên

**GET** `/api/frequent-groups/{id}`

Path variable:

| Parameter | Type | Mô tả |
|---|---|---|
| `id` | Long | ID nhóm |

Response:

```text
FrequentGroupResponse
```

---

# 4. Incoming Documents – Văn bản đến

Base path:

```text
/api/incoming-documents
```

Các API trong controller sử dụng thông tin user hiện tại thông qua `Authentication`.

### 4.1. Danh sách văn bản đến theo đơn vị

**GET** `/api/incoming-documents/unit`

Authentication: **Có**

Query parameters:

- Các trường của `IncomingDocumentSearchRequest`
- `page`
- `size` – mặc định 20
- `sort`

Response:

```text
Page<IncomingDocumentResponse>
```

### 4.2. Danh sách văn bản đến của tôi

**GET** `/api/incoming-documents/me`

Authentication: **Có**

Query parameters:

- Các trường của `IncomingDocumentSearchRequest`
- `page`
- `size` – mặc định 20
- `sort`

Response:

```text
Page<IncomingDocumentResponse>
```

### 4.3. Chi tiết văn bản đến theo đơn vị

**GET** `/api/incoming-documents/unit/{id}`

Authentication: **Có**

Path variable:

| Parameter | Type | Mô tả |
|---|---|---|
| `id` | Long | ID văn bản |

Response:

```text
IncomingDocumentDetailResponse
```

### 4.4. Chi tiết văn bản đến

**GET** `/api/incoming-documents/{id}`

Authentication: **Có**

Path variable:

| Parameter | Type | Mô tả |
|---|---|---|
| `id` | Long | ID văn bản |

Response:

```text
IncomingDocumentDetailResponse
```

### 4.5. Danh sách văn bản nội bộ

**GET** `/api/incoming-documents/internal`

Authentication: **Có**

Query parameters:

- Các trường của `IncomingDocumentSearchRequest`
- `page`
- `size` – mặc định 20
- `sort`

Response:

```text
Page<IncomingDocumentResponse>
```

### 4.6. Chi tiết văn bản nội bộ

**GET** `/api/incoming-documents/internal/{id}`

Authentication: **Có**

Path variable:

| Parameter | Type | Mô tả |
|---|---|---|
| `id` | Long | ID văn bản |

Response:

```text
IncomingDocumentDetailResponse
```

---

# 5. Submissions – Hồ sơ/phiếu trình

Base path:

```text
/api/submissions
```

### 5.1. Danh sách tất cả submission

**GET** `/api/submissions`

Query parameters:

- Các trường của `SubmissionSearchRequest`
- `page`
- `size` – mặc định 20
- `sort` – mặc định `submittedAt,DESC`

Response:

```text
Page<SubmissionResponse>
```

### 5.2. Submission đang dự thảo

**GET** `/api/submissions/drafting`

Query parameters:

- Các trường của `SubmissionSearchRequest`
- `page`
- `size`
- `sort` – mặc định `submittedAt,DESC`

Response:

```text
Page<SubmissionResponse>
```

### 5.3. Submission đang xin ý kiến

**GET** `/api/submissions/requesting-opinion`

Query parameters:

- Các trường của `SubmissionSearchRequest`
- `page`
- `size`
- `sort` – mặc định `submittedAt,DESC`

Response:

```text
Page<SubmissionResponse>
```

### 5.4. Chi tiết submission

**GET** `/api/submissions/{id}`

Path variable:

| Parameter | Type | Mô tả |
|---|---|---|
| `id` | Long | ID submission |

Response:

```text
SubmissionDetailResponse
```

### 5.5. Chi tiết submission đang dự thảo/xin ý kiến

**GET** `/api/submissions/drafts-or-opinions/{id}`

Path variable:

| Parameter | Type | Mô tả |
|---|---|---|
| `id` | Long | ID submission |

Response:

```text
SubmissionDetailResponse
```

### 5.6. Tạo submission

**POST** `/api/submissions`

Request body: `SubmissionCreateRequest`

Query parameter:

| Parameter | Type | Default | Mô tả |
|---|---|---|---|
| `actionType` | String | `SAVE_DRAFT` | Loại thao tác |

Ví dụ:

```http
POST /api/submissions?actionType=SAVE_DRAFT
Content-Type: application/json
```

Request body:

```json
{
  "...": "..."
}
```

Response:

```text
Submission
```

HTTP status:

```text
200 OK
```

> Source hiện tại không giới hạn các giá trị hợp lệ của `actionType`; giá trị mặc định được controller khai báo là `SAVE_DRAFT`.

### 5.7. Submission đã phát hành

**GET** `/api/submissions/published`

Query parameters:

- Các trường của `SubmissionSearchRequest`
- `page`
- `size` – mặc định 20
- `sort` – mặc định `publishedAt,DESC`

Response:

```text
Page<SubmissionResponse>
```

### 5.8. Submission bị tạm dừng

**GET** `/api/submissions/suspended`

Query parameters:

- Các trường của `SubmissionSearchRequest`
- `page`
- `size`
- `sort` – mặc định `submittedAt,DESC`

Response:

```text
Page<SubmissionResponse>
```

### 5.9. Submission bị trả lại

**GET** `/api/submissions/returned`

Query parameters:

- Các trường của `SubmissionSearchRequest`
- `page`
- `size`
- `sort` – mặc định `submittedAt,DESC`

Response:

```text
Page<SubmissionResponse>
```

---

# 6. Works – Công việc

Base path:

```text
/api/works
```

### 6.1. Công việc được giao cho tôi

**GET** `/api/works/assigned-to-me`

Authentication: **Có**

Thông tin user hiện tại được lấy thông qua `SecurityUtils.getCurrentUserId()`.

Query parameters:

- `page`
- `size` – mặc định 20
- `sort` – mặc định `assignedAt,DESC`

Response:

```text
Page<WorkResponse>
```

### 6.2. Công việc do tôi giao

**GET** `/api/works/assigned-by-me`

Authentication: **Có**

Query parameters:

- `page`
- `size` – mặc định 20
- `sort` – mặc định `assignedAt,DESC`

Response:

```text
Page<WorkResponse>
```

---

# 7. Work Records – Nhật ký công việc

Base path:

```text
/api/work-records
```

### 7.1. Danh sách nhật ký công việc do tôi tạo

**GET** `/api/work-records/created-by-me`

Query parameters:

- `page`
- `size` – mặc định 20
- `sort` – mặc định `assignedAt,DESC`

Response:

```text
Page<WorkRecordResponse>
```

### 7.2. Tạo nhật ký công việc

**POST** `/api/work-records`

Request body: `WorkRecordCreateRequest`

```json
{
  "...": "..."
}
```

Response:

```text
Long
```

Giá trị trả về là ID của work record vừa tạo.

HTTP status:

```text
200 OK
```

---

# 8. Quy ước phân trang

Các API trả về `Page<T>` sử dụng cơ chế phân trang của Spring Data.

Ví dụ:

```http
GET /api/submissions?page=0&size=20&sort=submittedAt,desc
```

Các tham số thường dùng:

| Parameter | Ví dụ | Ý nghĩa |
|---|---|---|
| `page` | `0` | Trang bắt đầu từ 0 |
| `size` | `20` | Số phần tử mỗi trang |
| `sort` | `submittedAt,desc` | Trường và hướng sắp xếp |

Cấu trúc response `Page` thông thường của Spring Data gồm thông tin danh sách dữ liệu và metadata phân trang.

---

# 9. Tổng hợp API

| Module | Method | Endpoint | Response |
|---|---|---|---|
| Auth | POST | `/api/auth/login` | `LoginResponse` |
| Draft | GET | `/api/draft-documents/all` | `Page<DraftDocumentResponse>` |
| Draft | GET | `/api/draft-documents/drafting-or-opinion` | `Page<DraftDocumentResponse>` |
| Draft | GET | `/api/draft-documents/approved` | `Page<DraftDocumentResponse>` |
| Draft | GET | `/api/draft-documents/suspended` | `Page<DraftDocumentResponse>` |
| Frequent Group | POST | `/api/frequent-groups` | `FrequentGroupResponse` |
| Frequent Group | GET | `/api/frequent-groups` | `Page<FrequentGroupResponse>` |
| Frequent Group | GET | `/api/frequent-groups/{id}` | `FrequentGroupResponse` |
| Incoming | GET | `/api/incoming-documents/unit` | `Page<IncomingDocumentResponse>` |
| Incoming | GET | `/api/incoming-documents/me` | `Page<IncomingDocumentResponse>` |
| Incoming | GET | `/api/incoming-documents/unit/{id}` | `IncomingDocumentDetailResponse` |
| Incoming | GET | `/api/incoming-documents/{id}` | `IncomingDocumentDetailResponse` |
| Incoming | GET | `/api/incoming-documents/internal` | `Page<IncomingDocumentResponse>` |
| Incoming | GET | `/api/incoming-documents/internal/{id}` | `IncomingDocumentDetailResponse` |
| Submission | GET | `/api/submissions` | `Page<SubmissionResponse>` |
| Submission | GET | `/api/submissions/drafting` | `Page<SubmissionResponse>` |
| Submission | GET | `/api/submissions/requesting-opinion` | `Page<SubmissionResponse>` |
| Submission | GET | `/api/submissions/{id}` | `SubmissionDetailResponse` |
| Submission | GET | `/api/submissions/drafts-or-opinions/{id}` | `SubmissionDetailResponse` |
| Submission | POST | `/api/submissions` | `Submission` |
| Submission | GET | `/api/submissions/published` | `Page<SubmissionResponse>` |
| Submission | GET | `/api/submissions/suspended` | `Page<SubmissionResponse>` |
| Submission | GET | `/api/submissions/returned` | `Page<SubmissionResponse>` |
| Work | GET | `/api/works/assigned-to-me` | `Page<WorkResponse>` |
| Work | GET | `/api/works/assigned-by-me` | `Page<WorkResponse>` |
| Work Record | GET | `/api/work-records/created-by-me` | `Page<WorkRecordResponse>` |
| Work Record | POST | `/api/work-records` | `Long` |

---

# 10. Lưu ý về phạm vi tài liệu

README này được xây dựng **chỉ từ các Controller được cung cấp**. Vì vậy:

- Các field chính xác của `LoginRequest`, `CreateFrequentGroupRequest`, `DraftSearchRequest`, `IncomingDocumentSearchRequest`, `SubmissionCreateRequest`, `SubmissionSearchRequest` và `WorkRecordCreateRequest` chưa được xác định trong source hiện tại.
- Cấu trúc JSON chi tiết của các Response cũng chưa được suy ra ngoài tên class.
- Cơ chế JWT/token, header Authorization và cấu hình Spring Security chưa xuất hiện trong phần source được cung cấp.
- Quyền truy cập cụ thể theo role chưa được thể hiện trong các Controller này.
- Logic nghiệp vụ và các mã lỗi cụ thể nằm ở Service/Exception Handler và không thể xác định chỉ từ Controller.

Do đó, các phần chưa có source được ghi rõ thay vì tự suy đoán.
