import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import _filter from "lodash/filter";
import Button from "../../atoms/Button";
import ListItem from "./ListItem";

class ViewBounties extends Component {
  static propTypes = {
    bounties: PropTypes.object.isRequired,
    claimants: PropTypes.object.isRequired,
    user: PropTypes.string.isRequired,
    instance: PropTypes.object.isRequired,
  };
  state = { filter: {} };
  noFilter = () => this.setState({ filter: {} });
  filterByUser = () => this.setState({ filter: { poster: this.props.user } });

  filterBounties = filter => _filter(this.props.bounties, filter);

  render() {
    const filteredBounties = this.filterBounties(this.state.filter);
    return (
      <Fragment>
        <h3>List of bounties:</h3>
        <Button onClick={this.noFilter}>View All Bounties</Button>
        <Button onClick={this.filterByUser}>View My Bounties</Button>
        {filteredBounties.map((bounty, key) => (
          <ListItem
            key={key}
            {...bounty}
            user={this.props.user}
            claimants={this.props.claimants[bounty.id] || []}
            instance={this.props.instance}
          />
        ))}
      </Fragment>
    );
  }
}

export default ViewBounties;
