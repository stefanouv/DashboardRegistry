import { useStateContext } from "../../Context/ContextProvider";
import { Card, Row, Col, Form } from "react-bootstrap";
import ValidatedField from "../ValidatedField/ValidatedField";
import {PopoverButton} from "../../Utils/popoverUtils";

const PortalMenuForm = ({ validationErrors, onValueChange }) => {
    const { formData, updateField } = useStateContext();

    // Form for the menu entry under which the dashboard appears in the internal portal
    const portalMenuFields = [
        { name: "menuName", label: "Menu Name", type: "text", placeholder: "Enter Menu Name", popoverMessage: "This is the name of the portal menu. It should be short and descriptive." },
        { name: "menuGroupName", label: "Menu Group Name", type: "text", placeholder: "Enter Menu Group Name", popoverMessage: "This represents the group that this menu belongs to." },
        { name: "menuEntryName", label: "Menu Entry Name", type: "text", placeholder: "Enter Menu Entry Name", popoverMessage: "This is the name of the entry that opens the dashboard." },
        { name: "accessRoles", label: "Access Roles", type: "text", placeholder: "Enter Roles with Access (e.g. Viewer, Manager)", popoverMessage: "Specify which user roles can see this menu entry." }
    ];

    return (
        <Card className="custom-card mb-4">
            <Card.Header className="custom-card-header">
                <legend className="h5 mb-0">Portal Menu Information</legend>
            </Card.Header>
            <hr />
            <Card.Body>
                <Form as="fieldset" className="form-section">
                    <Row className="g-3">
                        {portalMenuFields.map((field) => (
                            <Col xs={12} md={6} key={field.name}>
                                <ValidatedField
                                    type={field.type}
                                    name={field.name}
                                    label={
                                        <>
                                            {field.label}
                                            <PopoverButton message={field.popoverMessage} />
                                        </>
                                    }
                                    value={formData[field.name]}
                                    onChange={(e) => updateField(field.name, e.target.value)}
                                    placeholder={field.placeholder || ""}
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

export default PortalMenuForm;
