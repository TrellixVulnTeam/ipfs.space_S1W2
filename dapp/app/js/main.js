import React, { Component } from 'react';
import { Route, HashRouter, NavLink as RouterLink } from "react-router-dom";
import {
  Container, Navbar, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import Home from "./home.js";
import Manage from "./manage.js";
import Login from "./login.js";
import Help from "./help.js";

class Main extends Component {
  handleLogoutClick() {

  }

  handleDepositClick() {

  }

  render() {
    return (
      <HashRouter>
        <Container>
          <Navbar>
            <NavbarBrand tag={RouterLink} to="/">🚀 ipfs.space</NavbarBrand>

            <Nav>
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>Balance</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem href="#">Deposit</DropdownItem>
                  <DropdownItem href="#">Activity</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem>
                <NavLink tag={RouterLink} to="/manage">Manage</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RouterLink} to="/login">Login</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RouterLink} to="/logout">Logout</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RouterLink} to="/help">Help</NavLink>
              </NavItem>
            </Nav>
          </Navbar>

          <Container>
            <Route exact path="/" component={Home}/>
            <Route path="/manage" component={Manage}/>
            <Route path="/login" component={Login}/>
            <Route path="/help" component={Help}/>
          </Container>
        </Container>
      </HashRouter>
    );
  }
}

export default Main;
