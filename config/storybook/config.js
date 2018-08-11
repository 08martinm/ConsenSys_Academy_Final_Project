// import React from "react";
// import styled from "styled-components";
import { configure, addDecorator } from "@storybook/react";
import { configureActions } from "@storybook/addon-actions";
import backgrounds from "@storybook/addon-backgrounds";
import centered from "@storybook/addon-centered";
import { withKnobs } from "@storybook/addon-knobs";
import { checkA11y } from "@storybook/addon-a11y";

const req = require.context("../../src/components", true, /.stories.jsx?$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

// const Wrapper = styled.div`
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   overflow: scroll;
//   padding: 25px;
// `;

configureActions({
  depth: 100,
  clearOnStoryChange: true,
  limit: 20,
});
addDecorator(
  backgrounds([
    { name: "white", value: "#fff", default: true },
    { name: "black", value: "#000" },
    { name: "blue", value: "#15caf8" },
    { name: "blue", value: "red" },
  ]),
);
addDecorator(withKnobs);
addDecorator(centered);
addDecorator(checkA11y);

configure(loadStories, module);
