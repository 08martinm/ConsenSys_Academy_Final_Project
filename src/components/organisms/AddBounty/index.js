import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Button from "../../atoms/Button";
import Input from "../../atoms/Input";
import TextArea from "../../atoms/TextArea";

class AddBounty extends Component {
  static propTypes = { bountyInstance: PropTypes.object };
  static defaultProps = { bountyInstance: {} };
  state = {
    price: 0,
    completionExpiration: 0,
    reviewExpiration: 0,
    bountyText: "",
  };
  handleChange = ({ target: { id, value } }) => this.setState({ [id]: value });
  handleSubmit = async e => {
    e.preventDefault();
    await this.props.bountyInstance.addBounty(
      this.state.bountyText,
      this.state.completionExpiration,
      this.state.reviewExpiration,
      this.state.price,
    );
  };
  render() {
    return (
      <Fragment>
        <h3>Create a Bounty:</h3>
        <form onSubmit={this.handleSubmit}>
          <Input
            label="Price"
            type="number"
            value={this.state.price}
            id="price"
            onChange={this.handleChange}
          />
          <Input
            label="Bounty Expiration"
            type="number"
            value={this.state.completionExpiration}
            id="completionExpiration"
            onChange={this.handleChange}
          />
          <Input
            label="Review Period Expiration"
            type="number"
            value={this.state.reviewExpiration}
            id="reviewExpiration"
            onChange={this.handleChange}
          />
          <TextArea
            label="Bounty Explanation"
            type="text"
            value={this.state.bountyText}
            id="bountyText"
            onChange={this.handleChange}
          />
          <Button type="submit">Post</Button>
        </form>
      </Fragment>
    );
  }
}

export default AddBounty;
