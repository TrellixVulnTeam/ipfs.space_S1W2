import React, { Component } from 'react';
import { Container, Button, Table, InputGroup } from 'reactstrap';
import firebase from 'firebase';
import AddPinModal from './addpinmodal.js';

class Manage extends Component {

  constructor(props) {
    super(props);

    this.state =  {
      pins: {},
      addPinModalIsOpen: false
    };

    this.refreshPins = this.refreshPins.bind(this);
    this.addPinClicked = this.addPinClicked.bind(this);
    this.refreshClicked = this.refreshClicked.bind(this);
    this.addPinModalDismissed = this.addPinModalDismissed.bind(this);
  }

  refreshPins() {
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref('/pins/' + uid).once('value').then(function(snapshot) {
      const pins = snapshot.val();
      this.setState({pins: pins});
    }.bind(this));
  }

  addPinClicked() {
    this.setState({addPinModalIsOpen: true});
  }

  removePinClicked(key) {
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref('/pins/' + uid + '/' + key).remove();
    this.refreshPins();
  }

  refreshClicked() {
    this.refreshPins();
  }

  addPinModalDismissed() {
    this.setState({addPinModalIsOpen: false});
  }

  render() {
    let rows = Object.keys(this.state.pins).map(function(key) {
      const pin = this.state.pins[key];
      return (
        <tr key={key}>
          <td className="align-middle">/ipfs/{pin['fileHash']}</td>
          <td className="align-middle">0 GB</td>
          <td className="align-middle">
            <InputGroup size="sm">
              <Button outline size="sm" color="danger" onClick={this.removePinClicked.bind(this, key)}>Unpin</Button>
            </InputGroup>
          </td>
        </tr>
      );
    }.bind(this));

    return (
      <Container>
          <Button outline color="primary" size="sm" onClick={this.addPinClicked}>+ Pin</Button>{' '}
          <Button outline color="secondary" size="sm" onClick={this.refreshClicked}>⟳ Refresh</Button>

          <Table hover striped bordered className="mt-3">
              <thead>
                  <tr>
                      <th scope="col">Hash</th>
                      <th scope="col">Size</th>
                      <th scope="col">Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {rows}
              </tbody>
          </Table>

          <AddPinModal isOpen={this.state.addPinModalIsOpen} onDismiss={this.addPinModalDismissed}/>
      </Container>
    );
  }
}

export default Manage;
