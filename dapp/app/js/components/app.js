import React, { Component } from 'react';
import { Route, Link, withRouter } from "react-router-dom";
import {
  Container, Navbar, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import EmbarkJS from 'Embark/EmbarkJS';
import firebase from 'firebase';
import Home from "./home.js";
import Manage from "./manage.js";
import Login from "./login.js";
import Help from "./help.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true
    };

    this.handleLogoutClick = this.handleLogoutClick.bind(this);

    const config = {
        apiKey: "AIzaSyDyAmz2ahqbA4JN4xDydRij7ju3m6_QxhQ",
        authDomain: "ipfs-space.firebaseapp.com",
        databaseURL: "https://ipfs-space.firebaseio.com",
        projectId: "ipfs-space",
        storageBucket: "ipfs-space.appspot.com",
        messagingSenderId: "598908228635"
    };

    firebase.initializeApp(config);

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        this.setState({isLoggedIn: true});
      } else {
        this.setState({isLoggedIn: false});
      }
    }.bind(this));
  }

  handleLogoutClick() {
    firebase.auth().signOut().then(function(){
      this.props.history.push('/login');
    }.bind(this));
  }

  render() {
    let nav;

    if (this.state.isLoggedIn) {
      nav = (
        <Nav>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>Balance</DropdownToggle>
            <DropdownMenu>
              <DropdownItem href="#">Deposit</DropdownItem>
              <DropdownItem href="#">Activity</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem>
            <NavLink tag={Link} to="/manage">Manage</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="#" onClick={this.handleLogoutClick}>Logout</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/help">Help</NavLink>
          </NavItem>
        </Nav>
      );
    } else {
      nav = (
        <Nav>
          <NavItem>
            <NavLink tag={Link} to="/login">Login</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/help">Help</NavLink>
          </NavItem>
        </Nav>
      );
    }

    return (
        <Container>
          <Navbar>
            <NavbarBrand tag={Link} to="/">🚀 ipfs.space</NavbarBrand>
            {nav}
          </Navbar>

          <Container>
            <Route exact path="/" component={Home}/>
            <Route path="/manage" component={Manage}/>
            <Route path="/login" component={Login}/>
            <Route path="/help" component={Help}/>
          </Container>
        </Container>
    );
  }
}

export default withRouter(App);
