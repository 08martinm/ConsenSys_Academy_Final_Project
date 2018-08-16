import React, { Fragment, Component } from "react";
import PropTypes from "prop-types";
import Accordion from "../../molecules/Accordion";
import Button from "../../atoms/Button";

class Claimants extends Component {
  static propTypes = {
    bountyInstance: PropTypes.object.isRequired,
    claimants: PropTypes.array.isRequired,
    user: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
  };

  getTitle = claimantState => {
    switch (claimantState) {
      case "PendingApproval":
        return "Pending Bounty Owner's Approval";
      case "Approved":
        return "Bounty Owner Approved This Answer";
      case "Rejected":
        return "Bounty Owner Rejected This Answer";
      case "PendingArbitratorAssignment":
        return "Bounty owner rejected this answer and claimant has filed a dispute. Awaiting assignment of random arbitrator.";
      case "PendingArbitration":
        return "This dispute is awaiting a randomly selected arbitrator's final judgment.";
      case "FinalApproval":
        return "This bounty has been approved by an arbitrator.";
      case "FinalRejection":
        return "This bounty has been rejected by an arbitrator.";
      default:
        return "Something went wrong";
    }
  };

  approveAnswer = claimantId => {
    this.props.bountyInstance.approveBounty(this.props.id, claimantId);
  };

  raiseDispute = claimantId => {
    this.props.bountyInstance.disputeBounty(this.props.id, claimantId);
  };

  rejectAnswer = claimantId => {
    this.props.bountyInstance.rejectBounty(this.props.id, claimantId);
  };

  arbitrate = (claimantId, response) => {
    this.props.bountyInstance.arbitrate(this.props.id, claimantId, response);
  };

  render() {
    return this.props.claimants.map((obj, key) => (
      <Accordion
        key={key}
        isOpen={false}
        title={this.getTitle(obj.claimantState)}
      >
        <ul>
          <li>{`Responder: ${obj.address}`}</li>
          <li>{`Response: ${obj.answer}`}</li>
          {obj.claimantState === "PendingApproval" &&
            this.props.poster === this.props.user && (
              <Fragment>
                <Button onClick={() => this.approveAnswer(obj.claimantId)}>
                  Approve this answer
                </Button>
                <Button onClick={() => this.rejectAnswer(obj.claimantId)}>
                  Reject this answer
                </Button>
              </Fragment>
            )}
          {obj.claimantState === "Rejected" &&
            obj.address === this.props.user && (
              <Button onClick={() => this.raiseDispute(obj.claimantId)}>
                Dispute this result
              </Button>
            )}
          {obj.claimantState === "PendingArbitration" &&
            obj.arbiter === this.props.user && (
              <Fragment>
                Please arbitrate this result:
                <Button onClick={() => this.arbitrate(obj.claimantId, true)}>
                  This answer is correct
                </Button>
                <Button onClick={() => this.arbitrate(obj.claimantId, false)}>
                  This answer is incorrect
                </Button>
              </Fragment>
            )}
        </ul>
      </Accordion>
    ));
  }
}

export default Claimants;
