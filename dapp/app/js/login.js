import React, { Component } from 'react';
import { Container, Button, FormGroup, Form, Input, Label } from 'reactstrap';

class Login extends Component {
  handleLoginClick() {
    console.log("login");
  }

  handleSignupClick() {
    console.log("signup");
  }

  render() {
    return (
      <Container>
          <Form>
              <FormGroup>
                  <Label for="email">Email address</Label>
                  <Input id="email" type="email" placeholder="Enter email"/>
                  <small className="form-text text-muted">We will never share your email with anyone else.</small>
              </FormGroup>
              <FormGroup>
                  <Label for="pass">Password</Label>
                  <Input id="pass" type="password" placeholder="Password"/>
              </FormGroup>
              <FormGroup check>
                  <Label check>
                    <Input type="checkbox" />{' '}
                    Keep me logged in
                  </Label>
              </FormGroup>
              <Button outline color="primary" onClick={this.handleLoginClick}>Login</Button>{' '}
              <Button outline color="secondary" onClick={this.handleSignupClick}>Signup</Button>
          </Form>
      </Container>
    );
  }
}

export default Login;
