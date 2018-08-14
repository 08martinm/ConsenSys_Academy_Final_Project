import React, { Component } from "react";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

const Container = styled.div`
  width: 100%;
  padding: 0 10px;
  border: 1px solid black;
  border-radius: 5px;
  text-align: center;
  position: relative;
  width: 100%;
`;

const TitleRow = styled.div`
  padding: 5px 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  :hover {
    cursor: pointer;
  }
`;

const Arrow = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid black;
  transition: all 0.25s ease-in;
  ${props =>
    props.isOpen &&
    css`
      transform: rotate(180deg);
    `};
`;

class Accordion extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  };

  static defaultProps = {
    isOpen: false,
    title: "",
  };

  state = { isOpen: this.props.isOpen };

  handleClick = () => this.setState(state => ({ isOpen: !state.isOpen }));

  render() {
    return (
      <Container>
        <TitleRow onClick={this.handleClick}>
          <h3>{this.props.title}</h3>
          <Arrow isOpen={this.state.isOpen} />
        </TitleRow>
        {this.state.isOpen && this.props.children}
      </Container>
    );
  }
}

export default Accordion;
