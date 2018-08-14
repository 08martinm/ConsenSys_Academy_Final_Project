import React, { Component } from "react";
import contract from "truffle-contract";
import _has from "lodash/has";
import BountyStorageContract from "../../../build/contracts/BountyStorage.json";
import OraclizeTestContract from "../../../build/contracts/OraclizeTest.json";
import getWeb3 from "../../utils/getWeb3";
import AddBounty from "../organisms/AddBounty";
import AccountSelector from "../organisms/AccountSelector";
import ViewBounties from "../organisms/ViewBounties";
import Button from "../atoms/Button";

class Landing extends Component {
  state = {
    web3: null,
    bountyInstance: {},
    user: "",
    allBounties: {},
    allClaimants: {},
    accountInterval: null,
  };

  componentWillMount = async () => {
    try {
      const { web3 } = await getWeb3;
      const user = web3.eth.accounts[0];
      this.setState({ web3, user }, async () => {
        const {
          bountyInstance,
          oraclizeInstance,
        } = await this.initializeContracts();
        this.setState({ bountyInstance, oraclizeInstance }, async () => {
          const { allBounties, allClaimants } = await this.initializeData();
          this.initializeWatchers();
          const accountInterval = this.setMetaMaskAccountListener();
          this.setState({ allBounties, allClaimants, accountInterval });
        });
      });
    } catch (err) {
      console.log("Error initializing:", err);
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.state.accountInterval);
  };

  getBounty = async bountyId => {
    const bounty = await this.state.bountyInstance.bounties(bountyId);
    console.log("bounty is ", bounty);
    return {
      id: bounty[0].c[0],
      state: bounty[1].c[0],
      price: bounty[2].c[0],
      completionExpiration: bounty[3].c[0],
      reviewExpiration: bounty[4].c[0],
      poster: bounty[5],
      bountyText: bounty[6],
      claimants: {},
    };
  };

  getClaimantsForBounty = async bountyId => {
    const { c: res } = await this.state.bountyInstance.getClaimantNumber(
      bountyId,
    );
    const claimants = [];
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < res[0]; i += 1) {
      const arr = await this.state.bountyInstance.getClaimant(bountyId, i);
      console.log("arr is", arr);
      claimants.push({
        address: arr[0],
        answer: arr[1],
        claimantId: i,
        bountyId,
        approved: arr[4],
      });
    }
    /* eslint-enable no-await-in-loop */
    return claimants;
  };

  getNum = async () => {
    const randNum = await this.state.oraclizeInstance.randNum();
    console.log("randNum is", randNum.c[0]);
  };

  setMetaMaskAccountListener = () => {
    const accountInterval = setInterval(async () => {
      const currentUser = this.state.web3.eth.accounts[0];
      if (currentUser !== this.state.user) {
        const {
          bountyInstance,
          oraclizeInstance,
        } = await this.initializeContracts();
        this.setState({ user: currentUser, bountyInstance, oraclizeInstance });
      }
    }, 100);
    return accountInterval;
  };

  initializeContracts = async () => {
    const { web3, user } = this.state;
    const bountyStorage = contract(BountyStorageContract);
    const oraclizeTest = contract(OraclizeTestContract);
    bountyStorage.setProvider(web3.currentProvider);
    oraclizeTest.setProvider(web3.currentProvider);
    bountyStorage.defaults({ from: user });
    oraclizeTest.defaults({ from: user });
    const bountyInstance = await bountyStorage.deployed();
    const oraclizeInstance = await oraclizeTest.deployed();
    return { bountyInstance, oraclizeInstance };
  };

  initializeData = async () => {
    const allBounties = {};
    const allClaimants = {};
    const bountyNumber = await this.state.bountyInstance.nextBountyId();
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < bountyNumber; i += 1) {
      const currentBounty = await this.getBounty(i);
      allBounties[i] = currentBounty;
      const currentClaimants = await this.getClaimantsForBounty(i);
      allClaimants[i] = currentClaimants;
    }
    /* eslint-enable no-await-in-loop */
    return { allBounties, allClaimants };
  };

  initializeWatchers = () => {
    const { bountyInstance, oraclizeInstance } = this.state;
    bountyInstance.addedBounty(async (err, log) => {
      console.log("addedBounty log:", log);
      const id = log.args["_id"].c[0];
      if (!_has(this.state.allBounties, id)) {
        const bounty = await this.getBounty(id);
        this.setState(state => ({
          allBounties: { ...state.allBounties, [id]: bounty },
        }));
      }
    });
    bountyInstance.claimedBounty(async (err, log) => {
      console.log("claimedBounty log:", log);
      const bountyId = log.args["_bountyId"].c[0];
      const claimants = await this.getClaimantsForBounty(bountyId);
      this.setState(state => ({
        allClaimants: { ...state.allClaimants, [bountyId]: claimants },
      }));
    });
    bountyInstance.approvedBounty(async (err, log) => {
      console.log("approvedBounty log:", log);
      const bountyId = log.args["_bountyId"].c[0];
      const bounty = await this.getBounty(bountyId);
      const claimants = await this.getClaimantsForBounty(bountyId);
      this.setState(state => ({
        allBounties: { ...state.allBounties, [bountyId]: bounty },
        allClaimants: { ...state.allClaimants, [bountyId]: claimants },
      }));
    });
    const watch = (err, log) => console.log(err, log);
    console.log("oraclizeInstance is", oraclizeInstance);
    oraclizeInstance.LogInfo(watch);
    oraclizeInstance.LogPriceUpdate(watch);
    oraclizeInstance.LogUpdate(watch);
  };

  changeAccount = async ({ target: { value } }) => {
    const bountyStorage = contract(BountyStorageContract);
    bountyStorage.setProvider(this.state.web3.currentProvider);
    bountyStorage.defaults({ from: value });
    const bountyInstance = await bountyStorage.deployed();
    this.setState({ user: value, bountyInstance });
  };

  random = () => {
    this.state.oraclizeInstance.update();
  };

  render() {
    return (
      <div>
        <nav>Home</nav>
        <Button onClick={this.random}>Generate Random Number</Button>
        <Button onClick={this.getNum}>Get Number</Button>
        <main>
          <h1>Bounties</h1>
          <AccountSelector
            changeAccount={this.changeAccount}
            user={this.state.user}
          />
          <AddBounty bountyInstance={this.state.bountyInstance} />
          <ViewBounties
            bounties={this.state.allBounties}
            claimants={this.state.allClaimants}
            user={this.state.user}
            bountyInstance={this.state.bountyInstance}
          />
        </main>
      </div>
    );
  }
}

export default Landing;
