import { useStateContext } from '../Context/ContextProvider';

const Tabs = ({ onTableOpen }) => {
    const { activeTab, setActiveTab } = useStateContext();

    return (
        <div className='tabs full-width'>
            <button
                className={`tab ${activeTab === "registerForm" ? "active" : ""}`}
                onClick={() => {
                    setActiveTab("registerForm")
                    onTableOpen("registerForm");
                }}
            >
                Project Form
            </button>

            <button
                className={`tab ${activeTab === "mainTable" ? "active" : ""}`}
                onClick={() => {
                    setActiveTab("mainTable");
                    onTableOpen("mainTable");
                }}
            >
                Table Data
            </button>
          
            <button
                className={`tab ${activeTab === "auditLogTable" ? "active" : ""}`}
                onClick={() => {
                    setActiveTab("auditLogTable");
                    onTableOpen("auditLogTable");
                }}
            >
                Audit Log Table Data
            </button>
        </div>
    );
};

export default Tabs;