import React, { Component } from 'react';
import { Container, Button, Table } from 'reactstrap';

class Manage extends Component {
  render() {
    return (
      <Container>
          <Button outline color="primary" size="sm">+ Pin</Button>{' '}
          <Button outline color="secondary" size="sm">⟳ Refresh</Button>

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
