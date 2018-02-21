import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.js';
import { HashRouter } from "react-router-dom";
// FIXME: due to a bug in EmbarkJS, we need to do all the contract and framework
// imports in this main file.
import EmbarkJS from 'Embark/EmbarkJS';
import AppContract from 'Embark/contracts/AppContract';
import firebase from 'firebase';

import 'bootstrap/dist/css/bootstrap.css';

// Setup firebase
const config = {
    apiKey: "AIzaSyDyAmz2ahqbA4JN4xDydRij7ju3m6_QxhQ",
    authDomain: "ipfs-space.firebaseapp.com",
    databaseURL: "https://ipfs-space.firebaseio.com",
    projectId: "ipfs-space",
    storageBucket: "ipfs-space.appspot.com",
    messagingSenderId: "598908228635"
};

firebase.initializeApp(config);

ReactDOM.render(
  <HashRouter>
    <App />
  </HashRouter>,
  document.getElementById('root')
);
