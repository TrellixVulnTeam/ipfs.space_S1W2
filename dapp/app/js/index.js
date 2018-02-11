import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.js';
import { HashRouter } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
