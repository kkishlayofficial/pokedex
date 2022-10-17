import React from "react";
import { colors } from "../../colors/colors";
import styled from 'styled-components';

const ColoredLabel = ({ data }) => {
  return (
    <ColoredLabelContainer bgColor={colors[data]}>
      <span className="colored-label text-capitalize">{data}</span>
    </ColoredLabelContainer>
  );
};
export default ColoredLabel;

const ColoredLabelContainer = styled.div`
    display: inline-block;
    margin-top: 8px;
    margin-right: 5px;
    .colored-label {
      border: 1px solid black;
      padding: 3px;
      margin-top: 4px;
      border-radius: 4px;
      background: ${(props) => props.bgColor};
    }
`;