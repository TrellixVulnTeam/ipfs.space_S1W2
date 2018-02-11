import React, { Component } from 'react';
import { Container, Button, FormGroup, Form, Input, Label } from 'reactstrap';
import firebase from 'firebase';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: ""
    };

    this.handleLoginClick = this.handleLoginClick.bind(this);
    this.handleSignupClick = this.handleSignupClick.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleLoginClick() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function() {
      this.props.history.push('/manage');
    }.bind(this), function(error) {
      console.log('Erorr logging in: ' + error);
    }.bind(this));
  }

  handleSignupClick() {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(function() {
      this.props.history.push('/manage');
    }.bind(this), function(error) {
      console.log('Erorr signing up: ' + error);
    }.bind(this));
  }

  handleEmailChange(evt) {
    this.setState({email: evt.target.value});
  }

  handlePasswordChange(evt) {
    this.setState({password: evt.target.value});
  }

  render() {
    return (
      <Container>
          <Form>
              <FormGroup>
                  <Label for="email">Email address</Label>
                  <Input id="email" type="email" placeholder="Enter email" onChange={this.handleEmailChange}/>
                  <small className="form-text text-muted">We will never share your email with anyone else.</small>
              </FormGroup>
              <FormGroup>
                  <Label for="pass">Password</Label>
                  <Input id="pass" type="password" placeholder="Password" onChange={this.handlePasswordChange}/>
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
