// Utility function to check for empty required fields in a form
export const getValidationErrors = (formData) => {
    return Object.keys(formData).filter((field) => {
        // Skip validation for "query" if "customQueryFlag" is No
        // Skip validation for "refreshRate" if "connectionMode" is "Live"
        if ((field === "queryText" && formData.customQueryFlag === "No") ||
            (field === "refreshRate" && formData.connectionMode === "Live")) {
                return false;
            }
            // include field in errors if it is empty / falsy
            return !formData[field];
    });
};