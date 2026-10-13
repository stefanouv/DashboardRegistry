// --- General Information ---
export const generalFieldLabels = {
    dashboardName: "Dashboard Name",
    requestedBy: "Requested By",
    developedBy: "Developed By",
    completedDate: "Published Date"
};

// --- Team Information ---
export const teamFieldLabels = {
    teamName: "Team Name",
    teamManager: "Team Manager"
};

// --- Portal Menu Information ---
export const portalMenuFieldLabels = {
    menuName: "Menu Name",
    menuGroupName: "Menu Group Name",
    menuEntryName: "Menu Entry Name",
    accessRoles: "Access Roles"
};

// --- Publishing Information ---
export const publishingFieldLabels = {
    workspaceName: "Workspace",
    folderName: "Folder",
    publishedReportName: "Published Report Name",
    reportUrl: "Report URL"
};

// --- Data Information ---
export const dataFieldLabels = {
    dataSourceName: "Data Source Name Table",
    customQueryFlag: "Is Custom Query",
    queryText: "Query",
    sharedDataSource: "Shared Data Source?",
    connectionMode: "Connection Mode",
    refreshRate: "Refresh Rate",
    connectionUserDB: "Connection User / DB"
};

// --- Calculated Fields ---
export const calculatedFieldLabels = {
    calculatedFields: "Calculated Fields"
};

// --- Main Table Labels {Combine all the labels here (The final dictionary for the table)} ---
export const mainFieldLabels = {
    id: "ID",
    ...generalFieldLabels,
    ...teamFieldLabels,
    ...portalMenuFieldLabels,
    ...publishingFieldLabels,
    ...dataFieldLabels,
    ...calculatedFieldLabels,
    submittedAt: "Submitted At",
    currentStatus: "Current Status",
    updateStatus: "Update Status"
};

// --- Audit Table Labels ---
export const auditFieldLabels = {
    auditId: "Audit ID",
    dashboardId: "Dashboard ID",
    // changedBy: "Changed By",    // Re-enable when the backend returns changedBy (user login feature)
    previousStatus: "Previous Status",
    newStatus: "New Status",
    changeTimestamp: "Change Timestamp"
};