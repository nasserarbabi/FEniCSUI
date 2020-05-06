import React from 'react';
import ReactDOM from 'react-dom';
import App from "./components/App";

// Import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css';

// import bootstrap customization
import './css/bootstrapCustomization.css'

// Render main app
ReactDOM.render(<App/>, document.getElementById('app'));
