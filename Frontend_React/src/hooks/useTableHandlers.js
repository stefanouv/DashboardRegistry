import { useState } from "react";

// Builds the text shown in an error alert:
// 4xx errors carry a specific message from the backend (e.g. "Record 5 already has status 'Accepted'"),
// anything else falls back to the generic message.
const alertMessageFor = (error, fallback) =>
    error?.status >= 400 && error?.status < 500 && error.message ? error.message : fallback;

// Hook to manage table data and status changes.
// The table data itself lives in the context (mainList / auditList) so there is a single copy.
export const useTableHandlers = (context, errorMessages) => {
    const [selectedRowId, setSelectedRowId] = useState(null);           // Selected row

    // Alert states
    const [showStatusAlert, setShowStatusAlert] = useState(false);      // Show/Hide alert
    const [statusAlertMessage, setStatusAlertMessage] = useState("")    // Message to display
    const [statusAlertType, setStatusAlertType] = useState("confirm")   // "confirm" | "success" | "error"
    const [pendingStatus, setPendingStatus] = useState(null);           // Status waiting for confirmation

    const showLoadError = (error) => {
        console.error(error);
        setStatusAlertType("error");
        setStatusAlertMessage(errorMessages.loadTableFailed || "Failed to load table data.");
        setShowStatusAlert(true);
    };

    // Load main table data from backend (stored in context.mainList)
    const loadMainTableData = async () => {
        try {
            await context.getAllMainData();
        } catch (error) {
            showLoadError(error);
        }
    };

    // Load audit table data from backend (stored in context.auditList)
    const loadAuditTableData = async () => {
        try {
            await context.getAllAuditData();
        } catch (error) {
            showLoadError(error);
        }
    };

    // Toggle row selection
    const handleRowClick = (id) => {
        setSelectedRowId(prev => (prev === id ? null : id));
    };

    // Request status change (shows confirmation alert)
    const requestStatusChange = (currentStatus) => {
        if (!selectedRowId || !currentStatus) return;

        setPendingStatus(currentStatus);
        setStatusAlertMessage(`Are you sure you want to change the status of record ${selectedRowId} to "${currentStatus}"?`);
        setStatusAlertType("confirm");
        setShowStatusAlert(true);
    };

    const confirmStatusChange = async () => {
        if (!selectedRowId || !pendingStatus) return;

        setShowStatusAlert(false);          // Close confirm alert

        try {
            // Throws if the backend rejects the change
            await context.updateStatusById({
                id: selectedRowId,
                currentStatus: pendingStatus
            });

            setStatusAlertType("success");
            setStatusAlertMessage("Status updated successfully!");
            setShowStatusAlert(true);
        } catch (error) {
            console.error(error);
            setStatusAlertType("error");
            setStatusAlertMessage(alertMessageFor(error, errorMessages.updateFailed || "Update failed"));
            setShowStatusAlert(true);
        } finally {
            setPendingStatus(null);
            setSelectedRowId(null);
            // Refresh from the server so the table always shows the real state
            await loadMainTableData();
        }
    };

    return {
        mainTableData: context.mainList,
        auditTableData: context.auditList,
        selectedRowId,
        showStatusAlert,
        statusAlertMessage,
        statusAlertType,
        loadMainTableData,
        loadAuditTableData,
        handleRowClick,
        requestStatusChange,
        confirmStatusChange,
        setShowStatusAlert
    };
}
