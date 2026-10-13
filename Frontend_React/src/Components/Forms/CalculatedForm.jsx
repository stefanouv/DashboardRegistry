import { useStateContext } from "../../Context/ContextProvider";
import { Card, Row, Col, Form } from "react-bootstrap";
import ValidatedField from "../ValidatedField/ValidatedField";
import {PopoverButton} from "../../Utils/popoverUtils";

const CalculatedForm = ({ validationErrors, onValueChange }) => {
    const { formData, updateField} = useStateContext();

    // Form to capture calculated fields information
    const calculatedFields = [
        { name: "calculatedFields", label: "Which of the Fields are Calculated", as:"textarea", placeholder: "Enter Calculated Fields", rows: 4, popoverMessage: "This field allows you to specify which fields are calculated. Please provide the names of the calculated fields." },
    ];

    return (
        <Card className="custom-card mb-4">
            <Card.Header className="custom-card-header">
                <legend className="h5 mb-0">Calculated Fields</legend>
            </Card.Header>
            <hr />
            <Card.Body>
                <Form as="fieldset" className="form-section">
                    <Row className="g-3">
                        {calculatedFields.map((field) => (
                            <Col xs={12} key={field.name}>
                                <ValidatedField
                                    as={field.as}
                                    name={field.name}
                                    label={
                                        <>
                                            {field.label}
                                            <PopoverButton message={field.popoverMessage} />
                                        </>
                                    }
                                    value={formData[field.name]}
                                    onChange={(e) => updateField(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                    rows={field.rows}
                                    validationErrors={validationErrors}
                                    onValueChange={onValueChange}
                                />
                            </Col> 
                        ))}
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default CalculatedForm;