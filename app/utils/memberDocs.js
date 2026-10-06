// Required-document helpers shared by join checks and the profile page.

const FIELD_FOR_DOC = {
  "NIC Front": "nicFront",
  "NIC Back": "nicBack",
  "Electricity Bill": "electricityBill",
};

export function hasDoc(member, docName) {
  const field = FIELD_FOR_DOC[docName];
  if (field && member?.[field]) return true;
  return (member?.documents || []).some((d) => d.name === docName && d.url);
}

export function missingDocs(member, required = []) {
  return required.filter((d) => !hasDoc(member, d));
}
