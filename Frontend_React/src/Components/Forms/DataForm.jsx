import { useStateContext } from "../../Context/ContextProvider";
import { Card, Row, Col, Form } from "react-bootstrap";
import ValidatedField from "../ValidatedField/ValidatedField";
import {PopoverButton} from "../../Utils/popoverUtils";

// Form component to collect data source information
const DataForm = ({ validationErrors, onValueChange }) => {
    const { formData, updateField } = useStateContext();

    // Define all data-related fields with conditional behavior
    const dataFields = [
        { name: "dataSourceName", label: "Data Source Main Table", type: "text", placeholder: "Enter Data Source Main Table",
            popoverMessage: "This is the main table for the data source." },
        { name: "customQueryFlag", label: "Is Custom Query and What is the Query?", type: "radio",
            options: [{ label: "Yes", value: 'Yes' }, { label: "No", value: 'No' }],
            onChange: (value) => {
                updateField("customQueryFlag", value);
                if (value === "No") {
                    updateField("queryText", ''); // Clear query if "No" is selected
                    if (validationErrors.includes("queryText")) onValueChange("queryText"); // Trigger validation update for query
                }
            },
            popoverMessage: "Indicate whether you are using a custom query or not."
        },
        { name: "queryText", label: "Query", as: "textarea", rows: 4, placeholder: "Enter Query",
            disabled: formData.customQueryFlag === "No", // Disable textarea if "No" is selected
            validationFilter: () => 
                formData.customQueryFlag === "Yes" ? validationErrors : validationErrors.filter(f => f !== "queryText"),
            popoverMessage: "Provide the custom query if 'Yes' was selected above."
        },
        { name: "sharedDataSource", label: "Is the Data Source Shared on the BI Server?", type: "radio",
            options: [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }],
            popoverMessage: "Indicate whether this data source is published as a shared data source that other reports can reuse."
        },
        { name: "connectionMode", label: "Connection Mode", type: "radio",
            options: [{ label: "Live connection", value: "Live" },{ label: "Scheduled refresh", value: "Scheduled" }],
            onChange: (value) => {
                updateField("connectionMode", value);
                if (value === "Live") { // Clear refresh rate if "Live" is selected
                    updateField("refreshRate", '');
                    if (validationErrors.includes("refreshRate")) onValueChange("refreshRate"); // Trigger validation update for refresh rate
                }
            },
            popoverMessage: "Choose whether the dashboard queries the database live or uses a copy of the data that is refreshed on a schedule."
        },
        { name: "refreshRate", label: "Refresh Rate", as: "select",
            options: [
                { label: "Every 2 hours", value: "Every 2 hours" },
                { label: "Every 4 hours", value: "Every 4 hours" },
                { label: "Every 8 hours", value: "Every 8 hours" },
                { label: "Daily", value: "Daily" },
                { label: "Weekly", value: "Weekly" },
                { label: "Monthly", value: "Monthly" }
            ],
            disabled: formData.connectionMode === "Live", // Disable if "Live" is selected
            validationFilter: () => 
                formData.connectionMode === "Live" ? validationErrors.filter(f => f !== "refreshRate") : validationErrors, // Exclude refreshRate from validation if "Live" is selected
            popoverMessage: "Specify the refresh rate for the data source."
        },
        { name: "connectionUserDB", label: "Connection User / Database", type: "text", placeholder: "Enter Connection User / Database",
            popoverMessage: "Provide the connection user or database name."
        }
    ];

    return (
        <Card className="custom-card mb-4">
            <Card.Header className="custom-card-header">
                <legend className="h5 mb-0">Data Information</legend>
            </Card.Header>
            <hr />
            <Card.Body>
                <Form as="fieldset" className="form-section">
                    <Row>
                        {dataFields.map((field) => (
                            <Col xs={12} key={field.name}>
                                <ValidatedField
                                    {...field}
                                    label={
                                        <>
                                            {field.label}
                                            <PopoverButton message={field.popoverMessage} />
                                        </>
                                    }
                                    value={formData[field.name]}                                                                                    // Controlled input value
                                    onChange={(e) => field.onChange ? field.onChange(e.target.value) : updateField(field.name, e.target.value)}     // Update context on change
                                    validationErrors={field.validationFilter ? field.validationFilter() : validationErrors}                         // Pass validation errors
                                    onValueChange={onValueChange}                                                                                   // Callback to clear field error
                                />    
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default DataForm;