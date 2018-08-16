import React from "react";
import PropTypes from "prop-types";
import Accordion from "../../molecules/Accordion";
import ResponseForm from "./ResponseForm";
import Claimants from "./Claimants";

const ListItem = ({
  id,
  bountyState,
  price,
  completionExpiration,
  reviewExpiration,
  poster,
  bountyText,
  bountyInstance,
  claimants,
  user,
}) => (
  <Accordion isOpen={false} title={bountyText}>
    <Accordion title="Info">
      <ul>
        <li>{`Status: ${bountyState}`}</li>
        <li>{`Price: ${price}`}</li>
        <li>{`Completion Expiration: ${completionExpiration}`}</li>
        <li>{`Review Expiration: ${reviewExpiration}`}</li>
        <li>{`Poster: ${poster}`}</li>
        <li>{`Text: ${bountyText}`}</li>
      </ul>
    </Accordion>
    <Accordion title="Claim Bounty">
      {poster !== user &&
        (bountyState === "Unclaimed" || bountyState === "PendingApproval") && (
          <ResponseForm bountyInstance={bountyInstance} id={id} />
        )}
      {poster === user &&
        (bountyState === "Unclaimed" || bountyState === "PendingApproval") &&
        "This is your post. Please view the claimants or sign into another account to respond."}
      {(bountyState === "Resolved" || bountyState === "FinalApproval") &&
        "This bounty has already been successfully completed!"}
    </Accordion>
    <Accordion title="Claimants">
      <Claimants
        claimants={claimants}
        bountyInstance={bountyInstance}
        id={id}
        user={user}
        poster={poster}
        bountyState={bountyState}
      />
    </Accordion>
  </Accordion>
);

ListItem.propTypes = {
  id: PropTypes.number.isRequired,
  bountyState: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  completionExpiration: PropTypes.number.isRequired,
  reviewExpiration: PropTypes.number.isRequired,
  poster: PropTypes.string.isRequired,
  bountyText: PropTypes.string.isRequired,
  bountyInstance: PropTypes.object.isRequired,
  claimants: PropTypes.array.isRequired,
  user: PropTypes.string.isRequired,
};

export default ListItem;
