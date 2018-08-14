import React, { Component } from "react";
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

  handleClick = claimantId => {
    this.props.bountyInstance.approveBounty(this.props.id, claimantId);
  };
  render() {
    return this.props.claimants.map((obj, key) => (
      <Accordion
        key={key}
        isOpen={false}
        title={
          obj.approved ? (
            <p>
              <strong>Approved Answer: </strong>
              {obj.answer}
            </p>
          ) : (
            obj.answer
          )
        }
      >
        <ul>
          <li>{`Responder: ${obj.address}`}</li>
          <li>{`Response: ${obj.answer}`}</li>
          {!obj.approved &&
            this.props.poster === this.props.user && (
              <Button onClick={() => this.handleClick(obj.claimantId)}>
                Approve this answer
              </Button>
            )}
        </ul>
      </Accordion>
    ));
  }
}

export default Claimants;
