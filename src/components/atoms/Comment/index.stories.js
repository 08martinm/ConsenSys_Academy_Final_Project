import React from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
// import Comment from ".";

const StyledComment = styled.p`
  color: green;
`;

storiesOf("Comment", module).add("with text", () => (
  <StyledComment onClick={action("clicked")}>Hello Button</StyledComment>
));
