export async function fetchCommittees() {
  try {
    const res = await fetch("/api/committee");
    if (!res.ok) throw new Error("Failed to fetch committees");
    return res.json();

  } catch (eerr) {
    console.log("errr: ", eerr);
  }
}
export async function fetchCommitteebyId(id) {
  const res = await fetch(`/api/committee/${id}`);
  if (!res.ok) throw new Error("Failed to fetch committe by id");
  return res.json();
}

export async function createCommittee(data) {
  const res = await fetch("/api/committee", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create committee");
  return res.json();
}

export async function updateCommittee(id, data) {
  const res = await fetch("/api/committee", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) throw new Error("Failed to update committee");
  return res.json();
}

export async function deleteCommittee(id) {
  const res = await fetch("/api/committee", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error("Failed to delete committee");
  return res.json();
}

// memebrs
export const fetchMembers = async () => {
  const res = await fetch("/api/member");
  return await res.json();
};
// export async function fetchCommittees() {
//     const res = await fetch('/api/committee');
//     if (!res.ok) throw new Error('Failed to fetch committees');
//     return res.json();
//   }

export async function approveMember(committeeId, memberId) {
  const res = await fetch(
    `/api/member?committeeId=${committeeId}&memberId=${memberId}`,
    {
      method: "PATCH",
    }
  );
  if (!res.ok) throw new Error("Failed to approve member");
  return res.json();
}

export async function pingMember(committeeId, memberId, adminId, message) {
  const res = await fetch(`/api/committee/${committeeId}/ping`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, adminId, message }),
  });
  if (!res.ok) throw new Error("Failed to ping member");
  return res.json();
}

export async function updatePaymentStatus(committeeId, paymentId, status, adminId) {
  const res = await fetch(`/api/committee/${committeeId}/payment`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentId, status, adminId }),
  });
  if (!res.ok) throw new Error("Failed to update payment status");
  return res.json();
}

export async function updateCommitteeStatus(committeeId, action, adminId) {
  const res = await fetch(`/api/committee/${committeeId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, adminId }),
  });
  if (!res.ok) throw new Error("Failed to update committee status");
  return res.json();
}

export async function deleteMember(memberId) {
  const res = await fetch(`/api/member?id=${memberId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete member");
  return res.json();
}
