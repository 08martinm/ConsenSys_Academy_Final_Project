import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Select from "../../atoms/Select";

const AccountSelector = ({ changeAccount, user, accounts }) => (
  <Fragment>
    <h3>Choose Your Desired Ethereum Account:</h3>
    <Select onChange={changeAccount} value={user} options={accounts} />
  </Fragment>
);

AccountSelector.propTypes = {
  changeAccount: PropTypes.func.isRequired,
  user: PropTypes.string,
  accounts: PropTypes.array,
};

AccountSelector.defaultProps = {
  user: "",
  accounts: [],
};

export default AccountSelector;
