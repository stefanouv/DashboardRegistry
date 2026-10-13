// Helper function for normalizing dates to yyyy-mm-dd format, in the user's LOCAL time zone
// (the <input type="date"> filter is also local, so both sides compare the same calendar day).
export function normalizeDate(dateStr) {
    if (!dateStr) return "";

    // A plain date ("2026-10-11", e.g. completedDate) has no time zone: keep it as is
    if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;

    const date = new Date(dateStr);

    if (isNaN(date)) return "";                 // Not valid, return empty String

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;           // Ignores the time and returns yyyy-mm-dd
}
