import React from "react";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";
import { text } from "@storybook/addon-knobs";
import Accordion from ".";

const Container = styled.div`
  position: absolute;
  top: 5em;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
`;

storiesOf("Molecules/Accordion", module).add("default", () => (
  <Container>
    <Accordion title={text("title", "Example Title")} isOpen={false}>
      <p>{text("child text", "Example Child Text")}</p>
    </Accordion>
  </Container>
));
