import React, { Component } from 'react';
import {
  Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Button, Form,
  FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label
} from 'reactstrap';
import firebase from 'firebase';
import IPFS from 'ipfs';

class AddPinModal extends Component {
  constructor(props) {
    super(props);

    // Initialize IPFS node
    this.ipfs = new IPFS();

    this.state = {
      fileHash: "",
      fileSize: 0
    }

    this.saveClicked = this.saveClicked.bind(this);
    this.fileHashChanged = this.fileHashChanged.bind(this);
    this.cancelClicked = this.cancelClicked.bind(this);
    this.notifyDismiss = this.notifyDismiss.bind(this);
  }

  saveClicked() {
    // TODO: do some validation
    const uid = firebase.auth().currentUser.uid;
    const fileHash = this.state.fileHash;

    firebase.database().ref('/pins/' + uid).push({"fileHash": fileHash});

    this.notifyDismiss();
  }

  cancelClicked() {
    this.notifyDismiss();
  }

  notifyDismiss() {
    // notify that modal has been dismissed.
    if (typeof this.props.onDismiss === 'function') {
      this.props.onDismiss();
    }
  }

  fileHashChanged(evt) {
    const fileHash = evt.target.value;

    // TODO: validate the hash
    this.setState({fileHash: fileHash});

    // fetch file size
    this.ipfs.object.stat(fileHash, function(err, stat) {
      if (!err) {
        console.log("Retrieved IPFS object stat: " + stat);

        // convert size to GB
        const fileSize = stat.CumulativeSize/1000000000;
        this.setState({fileSize: fileSize});
      } else {
        console.log("Error fetching IPFS object stat: " + err);
      }
    }.bind(this));
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalHeader>Deposit</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="file-hash">IPFS hash</Label>
              <InputGroup>
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>/ipfs/</InputGroupText>
                </InputGroupAddon>
                <Input id="file-hash" onChange={this.fileHashChanged} value={this.state.fileHash}/>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <Label for="file-size">File size</Label>
              <InputGroup>
                <Input id="file-size" placeholder="0" readOnly value={this.state.fileSize}/>
                <InputGroupAddon addonType="append">
                  <InputGroupText>GB</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.saveClicked}>Save</Button>{' '}
          <Button color="secondary" onClick={this.cancelClicked}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default AddPinModal;
