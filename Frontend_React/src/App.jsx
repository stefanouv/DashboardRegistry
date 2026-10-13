// Import all form components
import GeneralForm from './Components/Forms/GeneralForm.jsx';
import TeamForm from './Components/Forms/TeamForm.jsx';
import PortalMenuForm from './Components/Forms/PortalMenuForm.jsx';
import PublishingForm from './Components/Forms/PublishingForm.jsx';
import DataForm from './Components/Forms/DataForm.jsx';
import CalculateForm from './Components/Forms/CalculatedForm.jsx';

// Import context and custom components
import { useStateContext } from './Context/ContextProvider.jsx';
import CustomAlert from './CustomAlert/CustomAlert.jsx';
import CustomButton from './CustomButton/CustomButton.jsx';

// import custom hooks
import { useSubmitHandler } from './hooks/useSubmitHandler.js';
import { useTableHandlers } from './hooks/useTableHandlers.js';

import Tabs from './Components/Tabs.jsx';
import SearchableDataTable from './Components/SearchableDataTable.jsx';
import SearchableAuditDataTable from './Components/SearchableAuditDataTable.jsx';
import { mainFieldLabels, auditFieldLabels } from './FieldLabels/fieldLabels.js';

function App() {
  const context = useStateContext();  // Access central context
  const { activeTab, setActiveTab/*, isAdmin*/ } = useStateContext();

  // Predefined error messages
  const errorMessages = {
    fillAllFields: <span>Please fill all the fields in all forms before submitting</span>,
    submissionFailed: <span>Submission failed. Please try again.</span>,
    loadTableFailed: <span>Failed to load table data. Please try again.</span>,
    updateFailed: <span>Failed to update the status of the record. Please try again.</span>
  };

  // Submit handlers
  const {
    validationErrors,
    showSubmitAlert,
    submitAlertMessage,
    submitAlertType,
    setShowSubmitAlert,
    handleSubmitAll,
    handleConfirmSubmission,
    clearFieldError
  } = useSubmitHandler(context, errorMessages);

  // Table handlers
  const {
    mainTableData,
    auditTableData,
    selectedRowId,
    showStatusAlert,
    setShowStatusAlert,
    loadMainTableData,
    loadAuditTableData,
    handleRowClick,
    requestStatusChange,
    confirmStatusChange,
    statusAlertMessage,
    statusAlertType
  } = useTableHandlers(context, errorMessages);

  const forms = [
    GeneralForm,
    TeamForm,
    PortalMenuForm,
    PublishingForm,
    DataForm,
    CalculateForm
  ];

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);

    if (tabName === "mainTable") {
      loadMainTableData();
    } else if (tabName === "auditLogTable") {
      loadAuditTableData();
    }
  };

  return (
    <main className="wrapper">
      <section className="content">
        {/* Tabs to switch between form and table */}
        <Tabs
          activeTab={activeTab}
          onTableOpen={handleTabChange}                 // Load main Table and auditTable when tab opens
          // isAdmin={isAdmin}
        />

        {/* Register Form Tab */}
        {activeTab === "registerForm" && (
          <>
            {forms.map((FormComponent, index) => (
              <FormComponent
                key={index}
                validationErrors={validationErrors}   // Pass validation errors to each form
                onValueChange={clearFieldError}       // Clear error on field change
              />
            ))}

            <div className="card-footer text-end">
              <CustomButton
                className="btn-success"
                onClick={handleSubmitAll}
              >
                Register Project
              </CustomButton>
            </div>
          </>
        )}

        {/* Table Tab */}
        {activeTab === "mainTable" && (
          <div className="table full-width">
            <h3>Table Data</h3>
            <SearchableDataTable
              tableData={mainTableData}               // Pass data to table
              selectedRowId={selectedRowId}           // Highlight selected row
              handleRowClick={handleRowClick}         // Row click handler
              handleToggleStatus={requestStatusChange}
              fieldLabels={mainFieldLabels}
              dateFields={["submittedAt", "updateStatus", "completedDate"]}
            />
          </div>
        )}

        {/* Audit Table Tab */}
        {activeTab === "auditLogTable" && (
          <div className="table full-width">
            <h3>Audit Log Table</h3>
            <SearchableAuditDataTable
              tableData={auditTableData}
              fieldLabels={auditFieldLabels}
              dateFields={["changeTimestamp"]}
            />
          </div>
        )}

        {/* Alerts */}
        {showSubmitAlert && (
          <CustomAlert
            title={
              submitAlertType === "error" ? "Error"
                : submitAlertType === "confirm" ? "Confirm Submission"
                : "Success"
            }
            message={submitAlertMessage}
            showCancel={submitAlertType === "confirm"}    //Show cancel only if no errors
            onConfirm={() => {
              if (submitAlertType === "confirm") {
                handleConfirmSubmission();                // Submit if no errors
              } else {
                setShowSubmitAlert(false);
              }
            }}
            onCancel={() => setShowSubmitAlert(false)}
          />
        )}

        {showStatusAlert && (
          <CustomAlert
            title={
              statusAlertType === "error" ? "Error"
              : statusAlertType === "confirm" ? "Confirm Status Change"
              : "Success"
            }
            message={statusAlertMessage}
            showCancel={statusAlertType === "confirm"}
            onConfirm={() => {
              if (statusAlertType === "confirm") {
                confirmStatusChange();
              } else {
                setShowStatusAlert(false);
              }
            }}
            onCancel={() => setShowStatusAlert(false)}
          />
        )}
      </section>
    </main>
  )
}

export default App;