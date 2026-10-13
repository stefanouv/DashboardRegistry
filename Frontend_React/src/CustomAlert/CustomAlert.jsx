// A reusable modal alert component for confirmation or error messages
const CustomAlert = ({ title, message, onConfirm, onCancel, showCancel = false }) => {
    return (
        <div className="custom-alert-overlay"> {/* Semi-transparent background overlay */}
            <div className="custom-alert-modal"> {/* Modal box */}
                <h3 className="custom-alert-title">{title}</h3>
                <p className="custom-alert-message">{message}</p>

                <div className="custom-alert-button">
                    <button onClick={onConfirm} className="custom-alert-button">
                        Ok
                    </button>

                    {showCancel && (
                        <button onClick={onCancel} className="custom-alert-button cancel">
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;