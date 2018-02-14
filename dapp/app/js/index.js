import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.js';
import { HashRouter } from "react-router-dom";
// FIXME: due to a bug in EmbarkJS, we need to do all the contract and framework
// imports in this main file.
import EmbarkJS from 'Embark/EmbarkJS';
import AppContract from 'Embark/contracts/AppContract';

import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
