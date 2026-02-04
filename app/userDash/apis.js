export async function submitPayment(committeeId, paymentData) {
    const res = await fetch(`/api/committee/${committeeId}/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to submit payment");
    }

    return await res.json();
}
