import React, { Fragment } from "react";
import PropTypes from "prop-types";

const AccountSelector = ({ user }) => (
  <Fragment>
    <p>
      You are currently logged in as: <strong>{user}</strong>
    </p>
  </Fragment>
);

AccountSelector.propTypes = {
  user: PropTypes.string,
};

AccountSelector.defaultProps = {
  user: "",
};

export default AccountSelector;
