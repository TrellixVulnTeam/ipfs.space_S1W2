import React, { Component } from 'react';
import {
  Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Button, Form,
  FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label
} from 'reactstrap';
import firebase from 'firebase';

class DepositModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.isOpen
    }

    this.cancelClicked = this.cancelClicked.bind(this);
    this.payClicked = this.payClicked.bind(this);
    this.amountChanged = this.amountChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({isOpen: nextProps.isOpen});
  }

  cancelClicked() {
    this.setState({isOpen: false});
  }

  payClicked() {

  }

  amountChanged() {

  }

  render() {
    return (
      <Modal isOpen={this.state.isOpen}>
        <ModalHeader>Deposit</ModalHeader>
        <ModalBody>
            <Form>
                <FormGroup>
                    <Label for="deposit-amount">Amount</Label>
                    <InputGroup>
                        <Input id="deposit-amount" placeholder="0.000"/>
                        <InputGroupAddon addonType="append">
                            <InputGroupText>ETH</InputGroupText>
                        </InputGroupAddon>
                    </InputGroup>
                    <small className="form-text text-muted">~$0</small>
                </FormGroup>
            </Form>
        </ModalBody>
        <ModalFooter>
            <Button color="primary" onClick={this.payClicked}>Pay</Button>{' '}
            <Button color="secondary" onClick={this.cancelClicked}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default DepositModal;
