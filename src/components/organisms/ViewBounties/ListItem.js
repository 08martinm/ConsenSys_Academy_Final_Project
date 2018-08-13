import React from "react";
import PropTypes from "prop-types";
import Accordion from "../../molecules/Accordion";
import ResponseForm from "./ResponseForm";
import Claimants from "./Claimants";

const ListItem = ({
  id,
  state,
  price,
  completionExpiration,
  reviewExpiration,
  poster,
  bountyText,
  instance,
  claimants,
  user,
}) => (
  <Accordion isOpen={false} title={bountyText}>
    <Accordion title="Info">
      <ul>
        <li>{`Status: ${state}`}</li>
        <li>{`Price: ${price}`}</li>
        <li>{`Completion Expiration: ${completionExpiration}`}</li>
        <li>{`Review Expiration: ${reviewExpiration}`}</li>
        <li>{`Poster: ${poster}`}</li>
        <li>{`Text: ${bountyText}`}</li>
      </ul>
    </Accordion>
    <Accordion title="Claim Bounty">
      {poster !== user &&
        state !== 3 && <ResponseForm instance={instance} id={id} />}
      {poster === user &&
        state !== 3 &&
        "This is your post. Please view the claimants or sign into another account to respond."}
      {state === 3 && "This bounty has already been successfully completed!"}
    </Accordion>
    <Accordion title="Claimants">
      <Claimants
        claimants={claimants}
        instance={instance}
        id={id}
        user={user}
        poster={poster}
      />
    </Accordion>
  </Accordion>
);

ListItem.propTypes = {
  id: PropTypes.number.isRequired,
  state: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  completionExpiration: PropTypes.number.isRequired,
  reviewExpiration: PropTypes.number.isRequired,
  poster: PropTypes.string.isRequired,
  bountyText: PropTypes.string.isRequired,
  instance: PropTypes.object.isRequired,
  claimants: PropTypes.array.isRequired,
  user: PropTypes.string.isRequired,
};

export default ListItem;
