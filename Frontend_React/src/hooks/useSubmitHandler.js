import { useState } from "react";
import { getValidationErrors } from "../Utils/Validation";

// Hook to manage form submission and validation
export const useSubmitHandler = (context, errorMessages) => {
    const [validationErrors, setValidationErrors] = useState([]);           // List of missing fields
    const [showSubmitAlert, setShowSubmitAlert] = useState(false);
    const [submitAlertMessage, setSubmitAlertMessage] = useState("");       // Alert message
    const [submitAlertType, setSubmitAlertType] = useState("error");        // "error" | "confirm" | "success"

    // Handle click on "Submit" button
    const handleSubmitAll = () => {

        console.log("FORM DATA:", context.formData);
        const errors = getValidationErrors(context.formData);               // Validate form
        console.log("ERRORS:", errors);

        if (errors.length > 0) {
            setValidationErrors(errors);
            setSubmitAlertType("error");
            setSubmitAlertMessage(errorMessages.fillAllFields);
            setShowSubmitAlert(true);
            return;
        }

        // If no errors, ask for confirmation
        setSubmitAlertType("confirm");
        setSubmitAlertMessage("Are you sure you want to submit?");
        setShowSubmitAlert(true);
    };

    // Confirm submission to backend
    const handleConfirmSubmission = async () => {
        setShowSubmitAlert(false);

        try {
            const timestamp = new Date().toISOString();  // Date + Time

            const dataToSubmit = {
                ...context.formData,
                submittedAt: timestamp,
                updateStatus: timestamp,
                currentStatus: "Requested"
            };

            await context.submit(dataToSubmit);     // Submit to backend
            context.resetForm();                    // Reset form
            setValidationErrors([]);
            setSubmitAlertType("success");
            setSubmitAlertMessage("Form submitted successfully!");
            setShowSubmitAlert(true);

        } catch (error) {
            console.error(error);
            // If the backend rejected specific fields, highlight them in the form as well
            if (Array.isArray(error?.fieldErrors) && error.fieldErrors.length > 0) {
                setValidationErrors(error.fieldErrors);
            }
            setSubmitAlertType("error");
            // 4xx -> show the backend's explanation, otherwise the generic message
            setSubmitAlertMessage(
                error?.status >= 400 && error?.status < 500 && error.message
                    ? error.message
                    : errorMessages.submissionFailed
            );
            setShowSubmitAlert(true);
        }
    };

    // Clear a field from validation errors when user modifies it
    const clearFieldError = (fieldName) => {
        setValidationErrors(prevErrors =>
            prevErrors.filter((e) => e !== fieldName)
        );
    };

    return {
        validationErrors,
        showSubmitAlert,
        submitAlertMessage,
        submitAlertType,
        setShowSubmitAlert,
        handleSubmitAll,
        handleConfirmSubmission,
        clearFieldError,
    };
};