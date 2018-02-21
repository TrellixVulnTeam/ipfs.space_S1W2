import React, { Component } from 'react';
import { Route, Redirect } from "react-router-dom";
import firebase from 'firebase';
import { omit } from 'lodash';

const PrivateRoute = (props) => {
  const Component = props.component;
  const isLoggedIn = props.isLoggedIn;
  const rest = omit(props, ["component", "isLoggedIn"]);

  return (
    <Route
      {...rest}
      render={props =>
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
}

export default PrivateRoute;
