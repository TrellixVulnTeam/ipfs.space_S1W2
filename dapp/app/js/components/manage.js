import React, { Component } from 'react';
import { Container, Button, Table } from 'reactstrap';
import firebase from 'firebase';

class Manage extends Component {

  constructor(props) {
    super(props);

    this.state =  {}

    this.addPinClicked = this.addPinClicked.bind(this)
    this.refreshClicked = this.refreshClicked.bind(this)
  }

  addPinClicked() {
    //firebase.database()
    console.log("add pin");

  }

  refreshClicked() {
    //firebase.database()
    console.log("refresh");
  }

  render() {
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
              </tbody>
          </Table>
      </Container>
    );
  }
}

export default Manage;
