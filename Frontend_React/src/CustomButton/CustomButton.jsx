// A reusable button component that accepts a click handler, content and optional className
const CustomButton = ({ onClick, children, className = "", ...props}) => {
    return (
        <button
            onClick={onClick}
            className={`btn ${className}`}  // Use passed className, default is empty
            type="button"
            {...props}  // Pass all other props like data-bs-toggle, aria-expanded, etc
        >
            {children}
        </button>
    );
};

export default CustomButton;