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
    this.depositModalDismissed = this.depositModalDismissed.bind(this);
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
          // "balance" comes back as a string for some reason... so we cast it
          // to a number here.
          const deposited = Number(balance);

          // Get usage from the DB to calculate remaining balance
          firebase.database().ref('/usage/' + uid).once('value').then(function(usageSnapshot) {
            const usage = usageSnapshot.val();
            const consumed = (usage && usage.consumed) ? usage.consumed : 0;

            // calculate remaining balance
            const remainingBalance = deposited - consumed;

            // update state
            this.setState({accountBalance: remainingBalance});
          }.bind(this));

        } else {
          console.log("Error retrieving balance from blockchain..." + err);
          toast.error("Error refreshing balance");
        }
      }.bind(this));
    }.bind(this));
  }

  prettifyBalance(balance) {
    // Convert balance to ether
    const ether = Number(web3.utils.fromWei(String(balance), 'ether'));

    // truncate value to 3 decimal places
    return Math.trunc(ether * 1000) / 1000;
  }

  depositModalDismissed() {
    this.setState({depositModalIsOpen: false});
  }

  render() {
    let nav;

    if (this.state.isLoggedIn) {
      nav = (
        <Nav>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>Balance: {this.prettifyBalance(this.state.accountBalance)} ETH</DropdownToggle>
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

        <DepositModal isOpen={this.state.depositModalIsOpen} onDismiss={this.depositModalDismissed}/>
      </Container>
    );
  }
}

export default withRouter(App);
