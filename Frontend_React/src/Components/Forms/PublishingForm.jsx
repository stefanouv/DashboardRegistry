import { useStateContext } from "../../Context/ContextProvider";
import { Card, Row, Col, Form} from 'react-bootstrap';
import ValidatedField from "../ValidatedField/ValidatedField";
import { PopoverButton  } from "../../Utils/popoverUtils";

// Form component to collect where the dashboard is published on the BI server
const PublishingForm =({ validationErrors, onValueChange }) => {
    const { formData, updateField } = useStateContext();

    // Define publishing-related fields
    const publishingFields = [
        { name: "workspaceName", label: "Workspace", type: "text", placeholder: "Enter Workspace Name", popoverMessage: "The workspace (or site) of the BI server where the dashboard is published." },
        { name: "folderName", label: "Folder", type: "text", placeholder: "Enter Folder Name", popoverMessage: "The folder (or project) inside the workspace." },
        { name: "publishedReportName", label: "Published Report Name", type: "text", placeholder: "Enter Published Report Name", popoverMessage: "The name of the report file as published on the BI server." },
        { name: "reportUrl", label: "Report URL", type: "text", placeholder: "Enter Report URL", popoverMessage: "The link that opens the dashboard."}
    ];

    return (
        <Card className="custom-card mb-4">
            <Card.Header className="custom-card-header">
                <legend className="h5 mb-0">Publishing Information</legend>
            </Card.Header>
            <hr />
            <Card.Body>
                <Form as="fieldset" className="form-section">
                    <Row className="g-3">
                        {publishingFields.map((field) => (
                            <Col xs={12} md={6} key={field.name}>
                                <ValidatedField
                                    {...field}
                                    label={
                                        <>
                                            {field.label}
                                            <PopoverButton message={field.popoverMessage} />
                                        </>
                                    }
                                    value={formData[field.name]}                                // Controlled input value
                                    onChange={(e) => updateField(field.name, e.target.value)}   // Update context on change
                                    validationErrors={validationErrors}                         // Pass validation errors
                                    onValueChange={onValueChange}                               // Callback to clear field error
                                />
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default PublishingForm;