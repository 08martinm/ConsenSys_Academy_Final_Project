import React, { Component } from "react";
import contract from "truffle-contract";
import _has from "lodash/has";
import MasterContract from "../../../build/contracts/Master.json";
import getWeb3 from "../../utils/getWeb3";
import AddBounty from "../organisms/AddBounty";
import AccountSelector from "../organisms/AccountSelector";
import ViewBounties from "../organisms/ViewBounties";

class Landing extends Component {
  state = {
    web3: null,
    bountyInstance: {},
    user: "",
    accounts: [],
    accountInterval: null,
    allBounties: {},
    allClaimants: {},
    bountyState: [
      "Unclaimed",
      "PendingApproval",
      "Resolved",
      "PendingArbitratorAssignment",
      "PendingArbitration",
      "FinalApproval",
    ],
    claimantState: [
      "PendingApproval",
      "Approved",
      "Rejected",
      "PendingArbitratorAssignment",
      "PendingArbitration",
      "FinalApproval",
      "FinalRejection",
    ],
  };

  componentWillMount = async () => {
    try {
      const { web3 } = await getWeb3;
      const user = web3.eth.accounts[0];
      this.setState({ web3, user, accounts: [user] }, async () => {
        const accountInterval = this.setMetaMaskAccountListener();
        const bountyInstance = await this.initializeContract();
        this.setState({ bountyInstance, accountInterval }, async () => {
          const { allBounties, allClaimants } = await this.initializeData(
            bountyInstance,
          );
          this.initializeWatchers(bountyInstance, allBounties);
          this.setState({ allBounties, allClaimants });
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
      bountyState: this.state.bountyState[bounty[1].c[0]],
      price: bounty[2].c[0],
      completionExpiration: bounty[3].c[0],
      reviewExpiration: bounty[4].c[0],
      poster: bounty[5],
      bountyText: bounty[6],
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
      const arbiter = await this.state.bountyInstance.getArbiter(bountyId, i);
      console.log("arr is", arr);
      claimants.push({
        address: arr[0],
        answer: arr[1],
        claimantId: i,
        bountyId,
        claimantState: this.state.claimantState[arr[4]],
        arbiter,
      });
    }
    /* eslint-enable no-await-in-loop */
    return claimants;
  };

  setMetaMaskAccountListener = () => {
    const accountInterval = setInterval(async () => {
      const currentUser = this.state.web3.eth.accounts[0];
      if (!this.state.accounts.includes(currentUser)) this.addAccount();
    }, 1000);
    return accountInterval;
  };

  initializeContract = async () => {
    const { web3, user } = this.state;
    const instance = contract(MasterContract);
    instance.setProvider(web3.currentProvider);
    instance.defaults({ from: user });
    const deployedInstance = await instance.deployed();
    return deployedInstance;
  };

  initializeData = async bountyInstance => {
    const allBounties = {};
    const allClaimants = {};
    const bountyNumber = await bountyInstance.nextBountyId();
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

  initializeWatchers = (bountyInstance, allBounties) => {
    bountyInstance.AddedBounty(async (err, log) => {
      console.log("AddedBounty log:", log);
      const id = log.args["id"].c[0];
      if (!_has(allBounties, id)) {
        const bounty = await this.getBounty(id);
        this.setState(state => ({
          allBounties: { ...state.allBounties, [id]: bounty },
        }));
      }
    });
    bountyInstance.ClaimedBounty(async (err, log) => {
      console.log("claimedBounty log:", log);
      const bountyId = log.args["bountyId"].c[0];
      const claimants = await this.getClaimantsForBounty(bountyId);
      this.setState(state => ({
        allClaimants: { ...state.allClaimants, [bountyId]: claimants },
      }));
    });
    const refreshData = async (err, log) => {
      console.log("log:", log);
      const bountyId = log.args["bountyId"].c[0];
      const bounty = await this.getBounty(bountyId);
      const claimants = await this.getClaimantsForBounty(bountyId);
      this.setState(state => ({
        allBounties: { ...state.allBounties, [bountyId]: bounty },
        allClaimants: { ...state.allClaimants, [bountyId]: claimants },
      }));
    };
    bountyInstance.ApprovedBounty(refreshData);
    bountyInstance.RejectedBounty(refreshData);
    bountyInstance.DisputedBounty(refreshData);
    bountyInstance.SelectedArbiter(refreshData);
    bountyInstance.Arbitrated(refreshData);
    bountyInstance.LogInfo((err, log) => console.log(err, log));
  };

  changeAccount = ({ target: { value } }) => {
    this.setState({ user: value }, async () => {
      const bountyInstance = await this.initializeContract();
      this.setState({ bountyInstance });
    });
  };

  addAccount = () => {
    const newAccount = this.state.web3.eth.accounts[0];
    this.setState(state => ({
      accounts: state.accounts.includes(newAccount)
        ? [...state.accounts]
        : [...state.accounts, newAccount],
    }));
  };

  render() {
    return (
      <div>
        <nav>Home</nav>
        <main>
          <h1>Bounties</h1>
          <AccountSelector
            changeAccount={this.changeAccount}
            user={this.state.user}
            accounts={this.state.accounts}
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
