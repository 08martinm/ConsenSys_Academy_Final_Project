import React, { Component } from "react";
import contract from "truffle-contract";
import _has from "lodash/has";
import BountyStorageContract from "../../../build/contracts/BountyStorage.json";
import getWeb3 from "../../utils/getWeb3";
import AddBounty from "../organisms/AddBounty";
import AccountSelector from "../organisms/AccountSelector";
import ViewBounties from "../organisms/ViewBounties";

class Landing extends Component {
  state = {
    web3: null,
    instance: {},
    user: "",
    allBounties: {},
    allClaimants: {},
  };

  componentWillMount = async () => {
    try {
      const { web3 } = await getWeb3;
      const bountyStorage = contract(BountyStorageContract);
      bountyStorage.setProvider(web3.currentProvider);
      bountyStorage.defaults({ from: web3.eth.accounts[0] });
      const instance = await bountyStorage.deployed();
      this.setState(
        { web3, instance, user: web3.eth.accounts[0] },
        async () => {
          const { allBounties, allClaimants } = await this.initializeData();
          this.initializeWatchers();
          this.setState({ allBounties, allClaimants });
        },
      );
    } catch (err) {
      console.log("Error initializing:", err);
    }
  };

  getBounty = async bountyId => {
    const bounty = await this.state.instance.bounties(bountyId);
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
    const { c: res } = await this.state.instance.getClaimantNumber(bountyId);
    const claimants = [];
    /* eslint-disable no-await-in-loop */
    for (let i = 0; i < res[0]; i += 1) {
      const arr = await this.state.instance.getClaimant(bountyId, i);
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

  initializeData = async () => {
    const allBounties = {};
    const allClaimants = {};
    const bountyNumber = await this.state.instance.nextBountyId();
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
    const { instance } = this.state;
    instance.addedBounty(async (err, log) => {
      console.log("addedBounty log:", log);
      const id = log.args["_id"].c[0];
      if (!_has(this.state.allBounties, id)) {
        const bounty = await this.getBounty(id);
        this.setState(state => ({
          allBounties: { ...state.allBounties, [id]: bounty },
        }));
      }
    });
    instance.claimedBounty(async (err, log) => {
      console.log("claimedBounty log:", log);
      const bountyId = log.args["_bountyId"].c[0];
      const claimants = await this.getClaimantsForBounty(bountyId);
      this.setState(state => ({
        allClaimants: { ...state.allClaimants, [bountyId]: claimants },
      }));
    });
    instance.approvedBounty(async (err, log) => {
      console.log("approvedBounty log:", log);
      const bountyId = log.args["_bountyId"].c[0];
      const bounty = await this.getBounty(bountyId);
      const claimants = await this.getClaimantsForBounty(bountyId);
      this.setState(state => ({
        allBounties: { ...state.allBounties, [bountyId]: bounty },
        allClaimants: { ...state.allClaimants, [bountyId]: claimants },
      }));
    });
  };

  changeAccount = async ({ target: { value } }) => {
    const bountyStorage = contract(BountyStorageContract);
    bountyStorage.setProvider(this.state.web3.currentProvider);
    bountyStorage.defaults({ from: value });
    const instance = await bountyStorage.deployed();
    this.setState({ user: value, instance });
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
            accounts={this.state.web3 ? this.state.web3.eth.accounts : []}
          />
          <AddBounty bountyInstance={this.state.instance} />
          <ViewBounties
            bounties={this.state.allBounties}
            claimants={this.state.allClaimants}
            user={this.state.user}
            instance={this.state.instance}
          />
        </main>
      </div>
    );
  }
}

export default Landing;
