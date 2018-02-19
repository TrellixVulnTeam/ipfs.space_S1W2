import React, { Component } from 'react';
import { Container, Button, FormGroup, Form, Input, Label } from 'reactstrap';
import firebase from 'firebase';
import { toast } from 'react-toastify';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      stayLoggedIn: false
    };

    this.loginClicked = this.loginClicked.bind(this);
    this.signupClicked = this.signupClicked.bind(this);
    this.emailChanged = this.emailChanged.bind(this);
    this.passwordChanged = this.passwordChanged.bind(this);
    this.stayLoggedInChanged = this.stayLoggedInChanged.bind(this);
  }

  stayLoggedInChanged(evt) {
    this.setState({stayLoggedIn: evt.target.checked});
  }

  loginClicked() {
    const persistenceLevel = this.state.stayLoggedIn ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION;

    firebase.auth().setPersistence(persistenceLevel).then(function() {

      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function() {
        this.props.history.push('/manage');
      }.bind(this), function(error) {
        toast.error(error.message);
      }.bind(this));

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
      toast.error(error.message);
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
            <Input type="checkbox" onChange={this.stayLoggedInChanged}/>{' '}
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
