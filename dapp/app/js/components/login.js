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

    this.loginClicked = this.loginClicked.bind(this);
    this.signupClicked = this.signupClicked.bind(this);
    this.emailChanged = this.emailChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
  }

  loginClicked() {
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function() {
      this.props.history.push('/manage');
    }.bind(this), function(error) {
      console.log('Erorr logging in: ' + error);
    }.bind(this));
  }

  signupClicked() {
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then(function(user) {
      firebase.database().ref('users/' + user.uid).set({
        uid: user.uid,
        email: user.email
      }).then(function(){
        this.props.history.push('/manage');
      }.bind(this));
    }.bind(this), function(error) {
      console.log('Erorr signing up: ' + error);
    }.bind(this));
  }

  emailChanged(evt) {
    this.setState({email: evt.target.value});
  }

  passwordChanged(evt) {
    this.setState({password: evt.target.value});
  }

  render() {
    return (
      <Container>
          <Form>
              <FormGroup>
                  <Label for="email">Email address</Label>
                  <Input id="email" type="email" placeholder="Enter email" onChange={this.emailChanged}/>
                  <small className="form-text text-muted">We will never share your email with anyone else.</small>
              </FormGroup>
              <FormGroup>
                  <Label for="pass">Password</Label>
                  <Input id="pass" type="password" placeholder="Password" onChange={this.passwordChanged}/>
              </FormGroup>
              <FormGroup check>
                  <Label check>
                    <Input type="checkbox" />{' '}
                    Keep me logged in
                  </Label>
              </FormGroup>
              <Button outline color="primary" onClick={this.loginClicked}>Login</Button>{' '}
              <Button outline color="secondary" onClick={this.signupClicked}>Signup</Button>
          </Form>
      </Container>
    );
  }
}

export default Login;
