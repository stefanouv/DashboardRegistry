import { useMemo, useState } from "react";
import { normalizeDate } from "../Utils/normalizeDate";

// sortField: the date field used to sort rows, newest first
// (e.g. "submittedAt" for the main table, "changeTimestamp" for the audit table)
export function useSearchableTable(tableData, searchFields, dateFields = [], sortField = "submittedAt") {
    const [searchText, setSearchText] = useState("");
    const [searchDate, setSearchDate] = useState("");

    // Filter tabledata based on all fields
    const filterData = useMemo(() => {
        const rows = Array.isArray(tableData) ? tableData : [];
        if (!searchText && !searchDate) return rows;

        return rows.filter(row => {

            // If first letter is a number search only on the ID field
            const isFirstCharNumeric = searchText && /^\d/.test(searchText);
            const fieldsToSearch = isFirstCharNumeric
                ? searchFields.filter(f => f === "id" || f === "auditId")
                : searchFields;

            // Text search (null/undefined values are treated as empty text)
            const matchesText = searchText
                ? fieldsToSearch.some(field => {
                    const value = row[field];
                    return String(value ?? "").toLowerCase().includes(searchText.toLowerCase());
                })
                : true;

            // Date search
            const matchesDate = searchDate
                ? dateFields.some(field => {
                    const normalized = normalizeDate(row[field]);
                    return searchDate === normalized;
                })
                : true;

            return matchesText && matchesDate;
        });
    }, [searchText, searchDate, tableData, searchFields, dateFields])


    // Sort by sortField descending (latest first)
    const sortedData = useMemo(() => {
        return filterData.slice().sort((a, b) => {
            const dateA = new Date(a[sortField]).getTime() || 0;
            const dateB = new Date(b[sortField]).getTime() || 0;
            return dateB - dateA;
        });
    }, [filterData, sortField]);

    return {
        searchText,
        setSearchText,
        searchDate,
        setSearchDate,
        data: sortedData
    };
}
