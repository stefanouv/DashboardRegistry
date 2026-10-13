import { Form } from 'react-bootstrap';

/**
 * Reusable validated form field component for inputs, selects, textareas and radios.
 * Automatically handles displaying errors and clearing them when the field changes.
 */
const ValidatedField = ({
    as = 'input',
    type = 'text',
    name,
    label,
    value,
    onChange,
    placeholder,
    options = [],
    validationErrors = [],
    errorMessage = 'Please fill out this field.',
    rows,
    inline = false,
    onValueChange,
    disabled = false,
    autoComplete = 'off'
}) => {

    // Check if this field currently has a validation error
    const hasError = !disabled && Array.isArray(validationErrors) && validationErrors.includes(name);

    // Handle input changes
    const handleChange = (e) => {
        onChange(e);                    // Update parent state
        if (hasError && onValueChange) {
            onValueChange(name);        // Remove this field from validation errors
        }
    };

    // Render error feedback under the field
    const renderErrorFeedback = () => hasError ? (
        <Form.Control.Feedback type="invalid" className="d-block">
            {errorMessage}
        </Form.Control.Feedback>
    ) : null;

    // --- Radio Buttons ---
    if (type === 'radio') {
        return (
            <Form.Group controlId={name} className={`mb-3 ${hasError ? 'is-invalid' : ''}`}>
                {label && <Form.Label className="mb-1 d-block">{label}</Form.Label>}
                {options.map((opt) => (
                    <Form.Check
                        key={opt.value}
                        type="radio"
                        id={`${name}-${opt.value}`}
                        name={name}
                        label={opt.label}
                        value={opt.value}
                        checked={value === opt.value}
                        onChange={handleChange}
                        inline={inline}
                        className={hasError ? 'is-invalid' : ''}
                    />
                ))}
                {renderErrorFeedback()}
            </Form.Group>
        );
    }

    // --- Select dropdowns ---
    if (as === 'select') {
        return (
            <Form.Group controlId={name} className="mb-3">
                {label && <Form.Label className="mb-1">{label}</Form.Label>}
                <Form.Select
                    name={name}
                    value={value ?? ''}   // fallback για controlled input
                    onChange={handleChange}
                    className={hasError ? 'is-invalid' : ''}
                    disabled={disabled}
                >
                    <option value="" disabled>
                        {placeholder || 'Select an option'}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </Form.Select>
                {renderErrorFeedback()}
            </Form.Group> 
        );
    }

    // --- Default input / textarea ---
    return (
        <Form.Group controlId={name} className="mb-3">
            {label && <Form.Label className="mb-1">{label}</Form.Label>}
            <Form.Control
                as={as}
                type={type}
                name={name}
                value={value ?? ''} // fallback για controlled input
                onChange={handleChange}
                placeholder={placeholder}
                rows={as === 'textarea' ? rows : undefined}
                className={hasError ? 'is-invalid' : ''}
                disabled={disabled}
                autoComplete={autoComplete}
            />
            {renderErrorFeedback()}
        </Form.Group>
    );
};

export default ValidatedField;