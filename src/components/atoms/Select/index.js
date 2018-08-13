import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledSelect = styled.select`
  padding: 10px 30px;
  border-radius: 10px;
`;

const Select = ({ onChange, value, options }) => (
  <StyledSelect onChange={onChange} value={value}>
    {options.map((val, key) => (
      <option key={key} value={val}>
        {val}
      </option>
    ))}
  </StyledSelect>
);

Select.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default Select;
