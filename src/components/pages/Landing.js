import React, { Component } from "react";
import contract from "truffle-contract";
import SimpleStorageContract from "../../../build/contracts/SimpleStorage.json";
import getWeb3 from "../../utils/getWeb3";

class Landing extends Component {
  state = { storageValue: 0, web3: null };

  componentWillMount = async () => {
    try {
      const results = await getWeb3;
      this.setState({ web3: results.web3 });
      this.instantiateContract();
    } catch (err) {
      console.log("Error finding web3.");
    }
  };

  instantiateContract = async () => {
    const simpleStorage = contract(SimpleStorageContract);
    simpleStorage.setProvider(this.state.web3.currentProvider);
    this.state.web3.eth.getAccounts(async (error, accounts) => {
      const instance = await simpleStorage.deployed();
      await instance.set(5, { from: accounts[0] });
      const result = await instance.get.call();
      this.setState({ storageValue: result.c[0] });
    });
  };

  render() {
    return (
      <div>
        <nav>Truffle Box</nav>

        <main>
          <div>
            <div>
              <h1>Good to Go!</h1>
              <p>Your Truffle Box is installed and ready.</p>
              <h2>Smart Contract Example</h2>
              <p>
                If your contracts compiled and migrated successfully, below will
                show a stored value of 5 (by default).
              </p>
              <p>
                Try changing the value stored on <strong>line 24</strong> of
                Landing.js.
              </p>
              <p>The stored value is: {this.state.storageValue}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default Landing;
