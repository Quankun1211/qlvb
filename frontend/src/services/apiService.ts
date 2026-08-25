const BASE_URL = "http://localhost:8080/api";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  headers.set("Content-Type", "application/json");

  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      window.location.href = "/login";
    }
    const errorText = await response.text();
    throw new Error(errorText || "API Error");
  }

  return response.json();
}

// ---------------------------
// 1. Văn bản dự thảo (Drafts)
// ---------------------------
export const draftService = {
  getAll: (page = 0, size = 20) => fetchWithAuth(`/draft-documents/all?page=${page}&size=${size}`),
  getDraftingOrOpinion: (page = 0, size = 20) => fetchWithAuth(`/draft-documents/drafting-or-opinion?page=${page}&size=${size}`),
  getApproved: (page = 0, size = 20) => fetchWithAuth(`/draft-documents/approved?page=${page}&size=${size}`),
  getSuspended: (page = 0, size = 20) => fetchWithAuth(`/draft-documents/suspended?page=${page}&size=${size}`),
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
};

// ---------------------------
// 5. Hồ sơ công việc (Work Records)
// ---------------------------
export const workRecordService = {
  getCreatedByMe: (page = 0, size = 20) => fetchWithAuth(`/work-records/created-by-me?page=${page}&size=${size}`),
};

// ---------------------------
// 6. Nhóm đơn vị (Frequent Groups)
// ---------------------------
export const frequentGroupService = {
  getAll: (page = 0, size = 20) => fetchWithAuth(`/frequent-groups?page=${page}&size=${size}`),
};
