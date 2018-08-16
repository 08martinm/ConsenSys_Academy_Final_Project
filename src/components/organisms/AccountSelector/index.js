import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Select from "../../atoms/Select";

const AccountSelector = ({ user, changeAccount, accounts }) => (
  <Fragment>
    <p>
      You are currently logged in as: <strong>{user}</strong>
    </p>
    <p>Change account:</p>
    <Select onChange={changeAccount} value={user} options={accounts} />
    <p>To add an account, perform the following steps:</p>
    <ol>
      <li>Change your account via MetaMask</li>
      <li>A listener will update the account selection options</li>
    </ol>
  </Fragment>
);

AccountSelector.propTypes = {
  changeAccount: PropTypes.func.isRequired,
  accounts: PropTypes.array.isRequired,
  user: PropTypes.string,
};

AccountSelector.defaultProps = {
  user: "",
};

export default AccountSelector;
