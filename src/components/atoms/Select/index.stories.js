import React, { Component } from "react";
import { storiesOf } from "@storybook/react";
import Select from ".";

const defaultAccounts = [
  "0x627306090abab3a6e1400e9345bc60c78a8bef57",
  "0x23ggdsfgds48sgsdfg434043540540sgfsg04500",
  "0x405490329453402fsjkgf405490540959040fgd0",
];

class Example extends Component {
  state = { value: defaultAccounts[0] };
  onChange = ({ target: { value } }) => this.setState({ value });
  render() {
    return (
      <Select
        onChange={this.onChange}
        value={this.state.value}
        options={defaultAccounts}
      />
    );
  }
}

storiesOf("Atoms/Select", module).add("default", () => <Example />);
