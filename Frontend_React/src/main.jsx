import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Styles/index.css';
import App from './App.jsx';
import { ContextProvider } from './Context/ContextProvider';

// Create a root element from the div with id="root" in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the application inside React's strict mode
root.render(
  <React.StrictMode>
    {/* Provide global context to all components in the app */}
    <ContextProvider>
      {/* Render the main App component */}
      <App />
    </ContextProvider>
  </React.StrictMode>
)