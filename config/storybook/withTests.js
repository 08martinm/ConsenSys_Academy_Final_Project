import { withTests } from "@storybook/addon-jest";
import results from "../../.jest-test-results.json";

export default withTests({
  results,
  filesExt: "((\\.specs?)$|(\\.unit.tests?)|(\\.tests?)).js$",
});
