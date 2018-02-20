import React, { Component } from 'react';
import { Route, Link, withRouter } from "react-router-dom";
import {
  Container, Navbar, NavbarBrand, Nav, NavItem, NavLink, UncontrolledDropdown,
  DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import EmbarkJS from 'Embark/EmbarkJS';
import AppContract from 'Embark/contracts/AppContract';
import firebase from 'firebase';
import Home from "./home.js";
import Manage from "./manage.js";
import Login from "./login.js";
import Help from "./help.js";
import DepositModal from "./depositmodal.js";


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: true,
      depositModalIsOpen: false,
      accountBalance: 0
    };

    this.logoutClicked = this.logoutClicked.bind(this);
    this.depositClicked = this.depositClicked.bind(this);
    this.onDepositModalDismissed = this.onDepositModalDismissed.bind(this);
    this.refreshBalance = this.refreshBalance.bind(this);

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
        this.refreshBalance();
      } else {
        this.setState({isLoggedIn: false});
      }
    }.bind(this));
  }

  logoutClicked() {
    firebase.auth().signOut().then(function(){
      this.props.history.push('/login');
    }.bind(this));
  }

  depositClicked() {
    this.setState({depositModalIsOpen: true});
  }

  refreshBalance() {
    firebase.auth().onAuthStateChanged(function(user) {
      const uid = user.uid;

      // Get balance from blockchain
      AppContract.methods.getBalance(uid).call(function(err, balance) {
        if (!err) {
          // Get usage from the DB and calculate remaining balance
          database.ref('/usage/' + uid).once('value').then(function(usageSnapshot) {
            const usage = usageSnapshot.val();
            const consumed = (usage && usage.consumed) ? usage.consumed : 0;

            const remainingBalance = balance - consumed;

            this.setState({accountBalance: remainingBalance});
        } else {
          toast.error("Error refreshing balance: " + err);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  onDepositModalDismissed() {
    this.setState({depositModalIsOpen: false});
  }

  render() {
    let nav;

    if (this.state.isLoggedIn) {
      nav = (
        <Nav>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>Balance: {web3.utils.fromWei(String(this.state.accountBalance), 'ether')} ETH</DropdownToggle>
            <DropdownMenu>
              <DropdownItem href="" onClick={this.depositClicked}>Deposit</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          <NavItem>
            <NavLink tag={Link} to="/manage">Manage</NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="" onClick={this.logoutClicked}>Logout</NavLink>
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
        <ToastContainer/>

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

        <DepositModal isOpen={this.state.depositModalIsOpen} onDismiss={this.onDepositModalDismissed}/>
      </Container>
    );
  }
}

export default withRouter(App);
