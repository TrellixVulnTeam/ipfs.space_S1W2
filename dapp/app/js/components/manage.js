import React, { Component } from 'react';
import { Container, Button, Table, InputGroup, Badge } from 'reactstrap';
import firebase from 'firebase';
import AddPinModal from './addpinmodal.js';
import { toast } from 'react-toastify';

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

  componentWillMount() {
    this.refreshPins();
  }

  refreshPins() {
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;

      firebase.database().ref('/pins/' + uid).once('value').then(function(snapshot) {
        const pins = snapshot.val() || {};
        this.setState({pins: pins});
      }.bind(this));
    }
  }

  addPinClicked() {
    this.setState({addPinModalIsOpen: true});
  }

  removePinClicked(key) {
    const user = firebase.auth().currentUser;
    if (user) {
      const uid = user.uid;
      firebase.database().ref('/pins/' + uid + '/' + key).remove();
      this.refreshPins();
      toast.success("Pin successfully removed");
    }
  }

  refreshClicked() {
    this.refreshPins();
  }

  addPinModalDismissed() {
    this.setState({addPinModalIsOpen: false});
    this.refreshPins();
  }

  render() {
    let rows = Object.keys(this.state.pins).map(function(key) {
      const pin = this.state.pins[key];
      return (
        <tr key={key}>
          <td className="align-middle">/ipfs/{pin['fileHash']}</td>
          <td className="align-middle">0 GB</td>
          <th className="align-middle"><Badge color="success">Pinned</Badge></th>
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
                      <th scope="col">Status</th>
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
