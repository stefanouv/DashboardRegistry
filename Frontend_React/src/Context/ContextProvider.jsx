import React, { createContext, useContext, useState, useCallback, useMemo} from "react";
import { POST, GET, PATCH} from "../services/requests";

// Create the context to share state across the app
const StateContext = createContext();

// Context provider component
export const ContextProvider = ({ children }) => {

    // Initial form data (memorized to avoid re-creation on every render)
    const initialFormData = useMemo(() => ({
        dashboardName: "",
        requestedBy: "",
        developedBy: "",
        completedDate: "",
        menuName: "",
        menuGroupName: "",
        menuEntryName: "",
        accessRoles: "",
        workspaceName: "",
        folderName: "",
        publishedReportName: "",
        reportUrl: "",
        dataSourceName: "",
        customQueryFlag: "No",
        queryText: "",
        sharedDataSource: "",
        connectionMode: "",
        refreshRate: "",
        connectionUserDB: "",
        teamName: "",
        teamManager: "",
        calculatedFields: "",
        currentStatus: "Requested"
    }), []);

    // State variables
    const [formData, setFormData] = useState(initialFormData);          // Holds all from fields
    const [mainList, setMainList] = useState([]);                       // List of Main records
    const [auditList, setAuditList] = useState([]);                     // List of Audit records
    // const [userName, setUserName] = useState(null);                  // Username from cookie
    // const [adminName, setAdminName] = useState([]);                  // Admin name from cookie
    const [activeTab, setActiveTab] = useState("registerForm")          // Set the admin and user access tabs

    // Initialize username from cookie on mount
    // useEffect(() => {
    //     getAllMainData()
    // }, []);

    // Admin access
    // const isAdmin = useMemo(() => {
    //     if (!userName || !Array.isArray(dashboardList)) return false;

    //     // Check if username existes in any adminName
    //     return dashboardList.some(record => record.userName === userName);
    // }, [userName, dashboardList]);

    // Update a single field in formData
    const updateField = (field, value) => {
        setFormData(prev => ({...prev, [field]: value}));
    };

    // Submit form data to backend.
    // Returns the saved record; errors are re-thrown so the caller can show them.
    const submit = async (data) => {
        console.log("Submitting:", data);

        // POST returns the saved record (DashboardDto) directly
        return await POST("/submit", data);

        // Extract username from response if available
        // if (response && response.userName) {
        //     setUserName(response.userName);
        // }
    };

    // Load all records from backend Main Table
    const getAllMainData = async () => {
        try {

            const data = await GET("/getAllMainData");
            // Extract username from response if available
            // if (response && response.userName) {
            //     setUserName(response.userName);
            // }

            // Extract adminName from response
            // if (response && response.adminName) {
            //     setAdminName(response.adminName);
            // }

            console.log("getAllMainData", data);

            const safeData = Array.isArray(data) ? data : [];
            setMainList(safeData);

            return safeData;            

        } catch (error) {
            console.error("Failed to fetch main data", error);
            setMainList([]);
            throw error;            // Let the caller show the "load failed" alert
        }
    };

    // Get all records from backend for Audit Table
    const getAllAuditData = async () => {
        try {
            const data = await GET("/getAllAuditData");

            // Extract username from response if available
            // if (response && response.userName) {
            //     setUserName(response.userName);
            // }

            // Extract adminName from response
            // if (response && response.adminName) {
            //     setAdminName(response.adminName);
            // }

            console.log("getAllAuditData", data);

            const safeData = Array.isArray(data) ? data : [];
            setAuditList(safeData);

            return safeData;            

        } catch (error) {
            console.error("Failed to fetch audit data", error);
            setAuditList([]);
            throw error;            // Let the caller show the "load failed" alert
        }
    };

    // Toggle column Status by ID
    const updateStatusById = async ({ id, currentStatus }) => {

        console.log("Full Payload:", { id, currentStatus/*, userName*/ });
        console.log("Sending status update for ID:", id, "with status:", currentStatus);        // Logging the ID being updated

        // PATCH returns the updated record (DashboardDto) directly.
        // On error PATCH throws (with the backend error_message), and we let it propagate
        // so the caller shows an error instead of "success".
        const updated = await PATCH(`/updateStatusById`, {id, currentStatus/*, userName*/});

        // // Extract username from response if available
        // if (response && response.userName) {
        //     setUserName(response.userName);
        // }

        // Update the list locally
        setMainList(prev => prev.map(item => item.id === id ? updated : item));
        return updated;
    };

    // Reset the form to initial values
    const resetForm = useCallback(() => {
        setFormData(initialFormData);
    }, [initialFormData]);

    // Provide all store and functions to children components
    const contextValue = {
        formData,
        updateField,
        resetForm,
        submit,
        getAllMainData,
        getAllAuditData,
        updateStatusById,
        mainList,
        auditList,
        setMainList,
        setAuditList,
        // userName,
        // adminName,
        activeTab,
        setActiveTab,
        // isAdmin
    };

    return (
        <StateContext.Provider value={contextValue}>
            {children}
        </StateContext.Provider>
    );
};

// Custom hook to use the context
export const useStateContext = () => useContext(StateContext);