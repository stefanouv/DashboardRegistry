import {useEffect } from "react";
import { useStateContext } from "../../Context/ContextProvider";
import { Card, Row, Col, Form} from 'react-bootstrap';
import ValidatedField from "../ValidatedField/ValidatedField";
import { PopoverButton  } from "../../Utils/popoverUtils";

// General form for general dashboard info
const GeneralForm = ({ validationErrors, onValueChange }) => {
    const { formData, updateField/*, username*/} = useStateContext();

    // Define general fields
    const generalFields = [
        { name: "dashboardName", label: "Dashboard Name", type: "text", placeholder: "Enter Dashboard Name", popoverMessage: "This is the name of the dashboard / report." },
        { name: "requestedBy", label: "Requested By", type: "text", placeholder: "Enter Requester's Name", popoverMessage: "Enter the name of the person requesting this dashboard." },
        { name: "developedBy", label: "Developed By", type: "text", placeholder: "Enter Developer's Name", popoverMessage: "Enter the name of the person who developed this dashboard." },
        { name: "completedDate", label: "Published Date", type: "date", popoverMessage: "Select the date the dashboard was published." }
    ];

    // Auto-fill developedBy with username when available
    // useEffect(() => {
    //     if (username && !formData.developedBy) {
    //         updateField("developedBy", username);
    //     } 
    // }, [username, formData.developedBy, updateField]);

    // Auto-fill completedDate with current date
    useEffect(() => {
        if (!formData.completedDate) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth()+ 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
            updateField("completedDate", formattedDate);
        }
    }, [formData.completedDate, updateField]);

    return (
        <Card className="custom-card mb-4">
            <Card.Header className="custom-card-header">
                <legend className="h5 mb-0">General Information</legend>
            </Card.Header>
            <hr />
            <Card.Body>
                <Form as="fieldset" className="form-section">
                    <Row className="g-3">
                        {generalFields.map((field) => (
                            <Col xs={12} md={6} key={field.name}>
                                <ValidatedField
                                    type={field.type}
                                    name={field.name}
                                    label={
                                        <>
                                            {field.label}
                                            <PopoverButton message = {field.popoverMessage} />
                                        </>
                                    }
                                    value={formData[field.name]}                                // Controlled input value
                                    onChange={(e) => updateField(field.name, e.target.value)}   // Update context on change
                                    placeholder = {field.placeholder || ""}
                                    validationErrors={validationErrors}                         // Pass validation errors
                                    onValueChange={onValueChange}                               // Callback to clear field error
                                    // disabled={field.name === "developedBy" && formData.developedBy ? true : false}
                                />
                            </Col>
                        ))}
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default GeneralForm;