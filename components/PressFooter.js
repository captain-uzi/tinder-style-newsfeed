import React from "react";
import styled from "styled-components";
import Default from "../utils/colors";
// import Button from '../Button';

const PressFooter = ({ height, tlBorder = true, ...rest }) => {
  return (
    <Wrapper {...{ tlBorder, height }}>
      {/* <Button primary paddingHorizontal={40} {...rest} /> */}
    </Wrapper>
  );
};

const Wrapper = styled.View`
  align-items: center;
  justify-content: center;

  ${({ tlBorder, height, theme: { colors, radii } }) => ({
    backgroundColor: Default.primary,
    borderTopLeftRadius: tlBorder ? 75 : 0,
    height,
  })}
`;

export default PressFooter;
