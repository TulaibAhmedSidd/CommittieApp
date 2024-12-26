export async function fetchCommittees() {
  const res = await fetch("/api/committee");
  if (!res.ok) throw new Error("Failed to fetch committees");
  return res.json();
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

export async function deleteMember(memberId) {
  const res = await fetch(`/api/member?id=${memberId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete member");
  return res.json();
}
