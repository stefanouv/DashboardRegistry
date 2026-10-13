import { useState } from "react";
import CustomButton from "../CustomButton/CustomButton";
import { exportRowToPDF } from "../Utils/exportRowToPDF";
import { useSearchableTable } from "../hooks/useSearchableTable";
import { PopoverButton } from "../Utils/popoverUtils";
import { mainFieldLabels } from "../FieldLabels/fieldLabels";

const SearchableDataTable = ({
    tableData,
    selectedRowId,
    handleRowClick,
    handleToggleStatus,
    dateFields = []
}) => {

    const columns = Object.keys(mainFieldLabels);
    const searchFields = columns;

    const {
        searchText,
        setSearchText,
        searchDate,
        setSearchDate,
        data: sortedData,
    } = useSearchableTable(tableData, searchFields, dateFields);

    const [expandedCells, setExpandedCells] = useState({});

    const toggleCell = (rowId, key) => {
        setExpandedCells(prev => ({ ...prev, [rowId]: { ...prev[rowId],  [key]: !prev[rowId]?.[key] }}));
    };

    const copyToClipboard = (text) => navigator.clipboard.writeText(text);

    // Status of the selected row -> colour of the "Toggle Status" button
    const selectedStatus = tableData?.find(row => row.id === selectedRowId)?.currentStatus;
    const statusButtonClass =
        selectedStatus === "Accepted" ? "btn-success"
        : ["Removed", "Rejected"].includes(selectedStatus) ? "btn-danger"
        : "btn-primary";                                    // "Requested" (default)

    const handleStatusChange = (currentStatus) => {
        if (!currentStatus || !selectedRowId) return;
        handleToggleStatus(currentStatus);
    }

    if (!tableData || tableData.length === 0) {
        return <p>No data available.</p>;
    }

    return (
        <div>
            {/* Controls: Search text +data (left) + Buttons (right) */}
            <div className="table-controls">
                <div className="search-controls">
                    {/* Input search text */}
                    <input
                        type="text"
                        placeholder={`Search`}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ padding: "5px 10px", width: "200px" }}
                    />

                    {/* Search Date */}
                    <input
                        type="Date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        style={{ padding: "5px 10px", width: "200px" }}
                    />
                </div>

                {/* Container for right position buttons */}
                <div className="right-buttons">
                    {/* Toggle Status and Export PDF button appears only if a row is selected */}
                    {selectedRowId && (
                        <>
                            <CustomButton
                                className="btn-success"
                                onClick={() => {
                                    const selectedRow = tableData.find(row => row.id === selectedRowId);
                                    if (selectedRow) exportRowToPDF(selectedRow, mainFieldLabels);
                                }}
                            >
                                Export PDF
                            </CustomButton>

                            <div className="dropdown">
                                <CustomButton
                                    className={`dropdown-toggle ${statusButtonClass}`}
                                    type="button"
                                    id="dropdownMenuButton"
                                    data-bs-toggle="dropdown"
                                >
                                    Toggle Status
                                </CustomButton>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    {["Requested","Accepted","Removed","Rejected"].map((currentStatus) => (
                                        <li key={currentStatus}>
                                            {/* The current status is disabled: choosing it again would change nothing */}
                                            <button
                                                className="dropdown-item"
                                                disabled={currentStatus === selectedStatus}
                                                onClick={() => handleStatusChange(currentStatus)}
                                            >
                                                {currentStatus}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="table-scroll-wrapper">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((key) => (
                                <th key={key} className="table-cell">
                                    {mainFieldLabels[key] ?? key}

                                    {/* Add popover for "queryText" column */}
                                    {key === "queryText" && (
                                        <PopoverButton message="With a left click anywhere in the field the query is copied" />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row) => (
                            <tr
                                key={row.id}
                                onClick={() => handleRowClick(row.id)}
                                className={`
                                        ${selectedRowId === row.id ? "selected" : ""}
                                        ${row.currentStatus === "Removed" || row.currentStatus === "Rejected" ? "row-removed" : ""}
                                    `}
                            >
                                {columns.map((key) => {
                                    const rawValue =row[key]?.toString() || "";
                                    const isDateColumn = key === "submittedAt" || key === "updateStatus";
                                    const cellValue = isDateColumn && rawValue ? new Date(rawValue).toLocaleString() : rawValue;
                                    const isExpanded = expandedCells[row.id]?.[key];
                                    const needsToggle = cellValue.length > 100;             // Adjust threshold as needed

                                    // --- QueryText Cell With Copy Feature ---
                                    if (key === "queryText") {
                                        return (
                                            <td
                                                key={key}
                                                className="query-cell"
                                                onClick={(e) => {
                                                    e.stopPropagation();                    // Prevent triggering row click
                                                    copyToClipboard(cellValue)               // Copy query text
                                                    const icon = e.currentTarget.querySelector(".copy-icon");   // Select the icon inside the Cell
                                                    if (!icon) return;
                                                    icon.textContent = "✅";                // Show check mark
                                                    setTimeout(() => {
                                                        icon.textContent = "📋";            // Revert back after 1 second    
                                                    }, 1000);
                                                }}      
                                            >
                                                <div className={`cell-content ${isExpanded ? "expanded" : "collapsed"}`}>
                                                    {cellValue}
                                                </div>

                                                {/* Always visible clipboard icon */}
                                                <span className="copy-icon" title="Copy Query">
                                                    📋
                                                </span>

                                                {needsToggle && (
                                                    <span
                                                        className="more-less-toggle"
                                                        onClick={(e) => {
                                                            e.stopPropagation();            // Prevent triggering copy
                                                            toggleCell(row.id, key)         // Expand/Collapse cell
                                                        }}              
                                                    >
                                                        {isExpanded ? "...less" : "...more"}
                                                    </span>
                                                )}
                                            </td>
                                        );
                                    }

                                    // --- All Other Cells ---
                                    return (
                                        <td key={key}>
                                            <div className={`cell-content ${isExpanded ? "expanded" : "collapsed"}`}>
                                                {cellValue}
                                            </div>

                                            {needsToggle && (
                                                <span
                                                    className="more-less-toggle"
                                                    onClick={(e) => {
                                                        e.stopPropagation();            // Prevent triggering copy
                                                        toggleCell(row.id, key)         // Expand/Collapse cell
                                                    }}              
                                                >
                                                    {isExpanded ? "...less" : "...more"}
                                                </span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SearchableDataTable;