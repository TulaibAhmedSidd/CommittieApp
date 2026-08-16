const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("admin_token") || localStorage.getItem("token");
};

const getAuthHeaders = (extraHeaders = {}) => {
  const token = getToken();
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchCommittees(adminId) {
  try {
    const url = adminId ? `/api/committee?adminId=${adminId}` : "/api/committee";
    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch committees");
    return res.json();
  } catch (eerr) {
    console.log("errr: ", eerr);
  }
}

export async function fetchCommitteebyId(id) {
  const res = await fetch(`/api/committee/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch committe by id");
  return res.json();
}

export async function createCommittee(data) {
  const res = await fetch("/api/committee", {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create committee");
  return res.json();
}

export async function updateCommittee(id, data) {
  const res = await fetch("/api/committee", {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update committee");
  return res.json();
}

export async function deleteCommittee(id) {
  const res = await fetch("/api/committee", {
    method: "DELETE",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete committee");
  return res.json();
}

export const fetchMembers = async () => {
  const res = await fetch("/api/member", {
    headers: getAuthHeaders(),
  });
  return await res.json();
};

export async function approveMember(committeeId, memberId) {
  const res = await fetch(
    `/api/member/approve`,
    {
      method: "PATCH",
      headers: getAuthHeaders({ "Content-Type": "application/json" }),
      body: JSON.stringify({ committeeId, memberId }),
    }
  );
  if (!res.ok) throw new Error("Failed to approve member");
  return res.json();
}

export async function pingMember(committeeId, memberId, adminId, message) {
  const res = await fetch(`/api/committee/${committeeId}/ping`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ memberId, adminId, message }),
  });
  if (!res.ok) throw new Error("Failed to ping member");
  return res.json();
}

export async function updatePaymentStatus(committeeId, paymentId, status, adminId, memberId) {
  const res = await fetch(`/api/committee/${committeeId}/payment`, {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ paymentId, status, adminId, memberId }),
  });
  if (!res.ok) throw new Error("Failed to update payment status");
  return res.json();
}

export async function updateCommitteeStatus(committeeId, action, adminId) {
  const res = await fetch(`/api/committee/${committeeId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ action, adminId }),
  });
  if (!res.ok) throw new Error("Failed to update committee status");
  return res.json();
}

export async function deleteMember(memberId) {
  const res = await fetch(`/api/member?id=${memberId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete member");
  return res.json();
}

export async function manageComRequest(committeeId, memberId, action, adminId) {
  const res = await fetch(`/api/committee/${committeeId}/request`, {
    method: "POST",
    headers: getAuthHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ memberId, action, adminId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update request");
  return data;
}
