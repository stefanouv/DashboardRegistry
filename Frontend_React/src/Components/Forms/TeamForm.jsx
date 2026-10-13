import { useStateContext } from "../../Context/ContextProvider";
import { Card, Row, Col, Form} from 'react-bootstrap';
import ValidatedField from "../ValidatedField/ValidatedField";
import { PopoverButton  } from "../../Utils/popoverUtils";

// Form component to collect team information
const TeamForm = ({ validationErrors, onValueChange }) => {
    const { formData, updateField } = useStateContext();

    //Define fields for this form
    const teamFields = [
        { name: "teamName", label: "Team Name", type: "text", placeholder: "Enter team name", popoverMessage: "This is the name of the team that you are entering." },
        { name: "teamManager", label: "Team Manager", type: "text", placeholder: "Enter Team Manager's Name", popoverMessage: "Provide the name of the manager overseeing the team." }
    ];

    return (
        <Card className="custom-card mb-4">
            <Card.Header className="custom-card-header">
                <legend className="h5 mb-0">Team Information</legend>
            </Card.Header>
            <hr />
            <Card.Body>
                <Form as="fieldset" className="form-section">
                    <Row className="g-3">
                        {teamFields.map((field) => (
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

export default TeamForm;