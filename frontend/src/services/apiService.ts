const BASE_URL = "http://localhost:8080/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
      return; // Dừng xử lý, tránh throw error gây console noise
    }
    const errorText = await response.text();
    throw new Error(errorText || "API Error");
  }

  return response.json();
}

export const fileNameUrl = {
  getFileName: (fileName: string) => fetchWithAuth(`/auth/presigned-url?fileName=${fileName}`)
}
// ---------------------------
// 1. Văn bản dự thảo (Drafts)
// ---------------------------
export const draftService = {
  getAll: (page = 0, size = 20) => fetchWithAuth(`/draft-documents/all?page=${page}&size=${size}`),
  getDraftingOrOpinion: (page = 0, size = 20) => fetchWithAuth(`/draft-documents/drafting-or-opinion?page=${page}&size=${size}`),
  getApproved: (page = 0, size = 20) => fetchWithAuth(`/draft-documents/approved?page=${page}&size=${size}`),
  getSuspended: (page = 0, size = 20) => fetchWithAuth(`/draft-documents/suspended?page=${page}&size=${size}`),
  create: (data: unknown, files: File[], actionType = "SAVE_DRAFT") => {
    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(data)], { type: "application/json" }));
    files.forEach(file => formData.append("files", file));
    return fetchWithAuth(`/draft-documents?actionType=${actionType}`, { method: "POST", body: formData });
  },
};

// ---------------------------
// 2. Văn bản đến (Incoming)
// ---------------------------
export const incomingService = {
  getUnitIncoming: (page = 0, size = 20) => fetchWithAuth(`/incoming-documents/unit?page=${page}&size=${size}`),
  getMyIncoming: (page = 0, size = 20) => fetchWithAuth(`/incoming-documents/me?page=${page}&size=${size}`),
  getInternal: (page = 0, size = 20) => fetchWithAuth(`/incoming-documents/internal?page=${page}&size=${size}`),
  getDetail: (id: number) => fetchWithAuth(`/incoming-documents/${id}`),
};

// ---------------------------
// 3. Công việc (Works)
// ---------------------------
export const workService = {
  getAssignedToMe: (page = 0, size = 20) => fetchWithAuth(`/works/assigned-to-me?page=${page}&size=${size}`),
  getAssignedByMe: (page = 0, size = 20) => fetchWithAuth(`/works/assigned-by-me?page=${page}&size=${size}`),
};

// ---------------------------
// 4. Hồ sơ/Phiếu trình (Submissions)
// ---------------------------
export const submissionService = {
  getAll: (page = 0, size = 20) => fetchWithAuth(`/submissions?page=${page}&size=${size}`),
  getDrafting: (page = 0, size = 20) => fetchWithAuth(`/submissions/drafting?page=${page}&size=${size}`),
  getRequestingOpinion: (page = 0, size = 20) => fetchWithAuth(`/submissions/requesting-opinion?page=${page}&size=${size}`),
  getPublished: (page = 0, size = 20) => fetchWithAuth(`/submissions/published?page=${page}&size=${size}`),
  getSuspended: (page = 0, size = 20) => fetchWithAuth(`/submissions/suspended?page=${page}&size=${size}`),
  getReturned: (page = 0, size = 20) => fetchWithAuth(`/submissions/returned?page=${page}&size=${size}`),
  create: (data: any, actionType = 'SAVE_DRAFT') =>
    fetchWithAuth(`/submissions?actionType=${actionType}`, { method: 'POST', body: JSON.stringify(data) }),
};

// ---------------------------
// 5. Hồ sơ công việc (Work Records)
// ---------------------------
export const workRecordService = {
  getCreatedByMe: (page = 0, size = 20) => fetchWithAuth(`/work-records/created-by-me?page=${page}&size=${size}`),
  getParticipated: (page = 0, size = 20) => fetchWithAuth(`/work-records/participated?page=${page}&size=${size}`),
  getFollowed: (page = 0, size = 20) => fetchWithAuth(`/work-records/followed?page=${page}&size=${size}`),
};

// ---------------------------
// 6. Nhóm đơn vị (Frequent Groups)
// ---------------------------
export const frequentGroupService = {
  getAll: (page = 0, size = 20) => fetchWithAuth(`/frequent-groups?page=${page}&size=${size}`),
  create: (data: any) => fetchWithAuth(`/frequent-groups`, { method: "POST", body: JSON.stringify(data) }),
};

// ---------------------------
// 8. Master Data
// ---------------------------
export const masterDataService = {
  getUnits: (type?: string) => fetchWithAuth(`/master-data/units${type ? `?type=${type}` : ''}`),
  getDepartments: () => fetchWithAuth(`/master-data/departments`),
  getUsers: () => fetchWithAuth(`/master-data/users`),
  getDocumentTypes: () => fetchWithAuth(`/master-data/document-types`),
  getUnitDepartmentsWithUsers: (unitId: number) => fetchWithAuth(`/master-data/units/${unitId}/departments-with-users`),
};

// ---------------------------
// 7. Văn bản đi (Outgoing)
// ---------------------------
export const outgoingService = {
  getAll: (page = 0, size = 20) => fetchWithAuth(`/outgoing-documents?page=${page}&size=${size}`),
  getPublished: (page = 0, size = 20) => fetchWithAuth(`/outgoing-documents/published?page=${page}&size=${size}`),
  getMyPublished: (page = 0, size = 20) => fetchWithAuth(`/outgoing-documents/published/my?page=${page}&size=${size}`),
  getDetail: (id: number) => fetchWithAuth(`/outgoing-documents/${id}`),
};

// ---------------------------
// 8. Unit
// ---------------------------
export const unitService = {
  getAll: () => fetchWithAuth(`/units/tree`),
};