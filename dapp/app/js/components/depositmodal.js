import React, { Component } from 'react';
import {
  Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, Button, Form,
  FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText, Label
} from 'reactstrap';
import firebase from 'firebase';
import Constants from './constants.js';
import EmbarkJS from 'Embark/EmbarkJS';
import AppContract from 'Embark/contracts/AppContract';
import { toast } from 'react-toastify';

class DepositModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: 0,
      dollarEstimate: 0
    }

    this.cancelClicked = this.cancelClicked.bind(this);
    this.payClicked = this.payClicked.bind(this);
    this.amountChanged = this.amountChanged.bind(this);
    this.notifyDismiss = this.notifyDismiss.bind(this);
  }

  cancelClicked(evt) {
    this.setState({
      amount: 0,
      dollarEstimate: 0
    });

    this.notifyDismiss();
  }

  notifyDismiss() {
    // notify that modal has been dismissed.
    if (typeof this.props.onDismiss === 'function') {
      this.props.onDismiss();
    }
  }

  payClicked() {
    web3.eth.getAccounts().then(function(accounts) {
      var uid = firebase.auth().currentUser.uid;
      var account = accounts[0];
      var amount = this.state.amount;
      var wei = web3.utils.toWei(String(amount), 'ether');

      // TODO: estimate gas
      // var gasEstimate = App.methods.addPin(fileHash).estimateGas()

      AppContract.methods.deposit(uid).send({
        from: account,
        value: wei,
        gas: 900000
      }).then(function(){
        this.notifyDismiss();
        toast.success("Successfully deposited " + amount + " ETH");
      }.bind(this));
    }.bind(this));
  }

  amountChanged(evt) {
    const amount = Number(evt.target.value);

    this.setState({
      amount: amount,
      dollarEstimate: amount * Constants.ETH_TO_USD
    });
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen}>
        <ModalHeader>Deposit</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label for="deposit-amount">Amount</Label>
              <InputGroup>
                <Input id="deposit-amount" placeholder="0.000" onChange={this.amountChanged}/>
                <InputGroupAddon addonType="append">
                  <InputGroupText>ETH</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <small className="form-text text-muted">~${this.state.dollarEstimate}</small>
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
