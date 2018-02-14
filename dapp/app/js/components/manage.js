import React, { Component } from 'react';
import { Container, Button, Table, InputGroup } from 'reactstrap';
import firebase from 'firebase';

class Manage extends Component {

  constructor(props) {
    super(props);

    this.state =  {
      pins: {}
    };

    this.refreshPins = this.refreshPins.bind(this);
    this.addPinClicked = this.addPinClicked.bind(this);
    this.refreshClicked = this.refreshClicked.bind(this);
  }

  refreshPins() {
    const uid = firebase.auth().currentUser.uid;
    firebase.database().ref('/pins/' + uid).once('value').then(function(snapshot) {
      const pins = snapshot.val();
      this.setState({pins: pins});
    }.bind(this));
  }

  addPinClicked() {
    //firebase.database()
    console.log("add pin");
  }

  refreshClicked() {
    this.refreshPins();
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
              <Button outline size="sm" color="danger">Unpin</Button>
            </InputGroup>
          </td>
        </tr>
      );
    }.bind(this));

    return (
      <Container>
          <Button outline color="primary" size="sm" onClick={this.addPinClicked}>+ Pin</Button>{' '}
          <Button outline color="secondary" size="sm" onClick={this.refreshClicked}>⟳ Refresh</Button>

          <Table hover striped bordered>
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
      </Container>
    );
  }
}

export default Manage;
