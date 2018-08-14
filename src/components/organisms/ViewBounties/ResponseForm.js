import React, { Component } from "react";
import PropTypes from "prop-types";
import TextArea from "../../atoms/TextArea";
import Button from "../../atoms/Button";

class ResponseForm extends Component {
  static propTypes = {
    bountyInstance: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
  };
  state = { response: "" };
  handleChange = ({ target: { id, value } }) => this.setState({ [id]: value });
  handleSubmit = e => {
    e.preventDefault();
    const { bountyInstance, id } = this.props;
    bountyInstance.claimBounty(id, this.state.response);
  };
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextArea
          rows="4"
          cols="50"
          id="response"
          value={this.state.response}
          onChange={this.handleChange}
        />
        <Button>Submit</Button>
      </form>
    );
  }
}

export default ResponseForm;
