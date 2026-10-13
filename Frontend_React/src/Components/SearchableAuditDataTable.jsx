import { useState } from "react";
import CustomButton from "../CustomButton/CustomButton";
import { exportRowToPDF } from "../Utils/exportRowToPDF";
import { useSearchableTable } from "../hooks/useSearchableTable";
import { auditFieldLabels } from "../FieldLabels/fieldLabels";

const SearchableAuditDataTable = ({
    tableData,
    dateFields = []
}) => {

    const[selectedRowId, setSelectedRowId] = useState(null);
    const columns = Object.keys(auditFieldLabels);

    const {
        searchText,
        setSearchText,
        searchDate,
        setSearchDate,
        data: filterData,
    } = useSearchableTable(tableData, columns, dateFields, "changeTimestamp");

    const handleRowClick = (auditId) => {
        setSelectedRowId(prev => (prev === auditId ? null : auditId));
    };

    if (!tableData || tableData.length === 0) {
        return <p>No data available</p>;
    }

    return (
        <div>
            {/* Controls: Search text + date (left) + Export PDF (right)*/}
            <div className="table-controls">
                <div className="search-controls">
                    {/* Search Text */}
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ padding: "5px 10px", width: "200px" }}
                    />
                </div>

                {/* Search Date */}
                <input
                    type="Date"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    style={{ padding: "5px 10px", width: "200px" }}
                />

                {/* Export PDF */}
                <div className="right-buttons">
                    {selectedRowId && (
                        <CustomButton
                            className="btn-success"
                            onClick={() => { 
                                const selectedRow = tableData.find(row => row.auditId === selectedRowId);
                                if (selectedRow) exportRowToPDF(selectedRow, auditFieldLabels);
                            }}
                        >
                            Export PDF
                        </CustomButton>
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
                                    {auditFieldLabels[key] ?? key}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filterData.map(row => (
                            <tr
                                key={row.auditId}
                                onClick={() => handleRowClick(row.auditId)}
                                className={selectedRowId === row.auditId ? "selected" : ""}
                            >
                                {columns.map(key => (
                                    <td key={key}>
                                        {
                                            dateFields.includes(key) && row[key]
                                            ? new Date(row[key]).toLocaleDateString()
                                            : row[key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SearchableAuditDataTable;