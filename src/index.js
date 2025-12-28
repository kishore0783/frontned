import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated for React 18+
import './index.css'; // Optional, remove if not used
import App from './App';

const rootElement = document.getElementById('root'); // Matches id in index.html
if (!rootElement) {
  throw new Error("Root element not found. Ensure that the 'index.html' file contains a <div id='root'>.");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
