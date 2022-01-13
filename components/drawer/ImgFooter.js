import React from "react";
import styled from "styled-components";
import calendar from "../../utils/calendar";
import images from "../../screens/Themes/Images";
import Image from "../../utils/Image";
import View from "../../utils/View";
const { FOOTER_IMGH } = calendar;

const ImgFooter = () => {
  return (
    <>
      <View bdBox>
        <Image topCurve source={images.bg1} />
      </View>
      <Footer>
        <Image source={images.bg1} />
      </Footer>
    </>
  );
};

const Footer = styled.View`
  overflow: hidden;
  margin-top: -0.15px;

  ${({ theme: { radii } }) => ({
    borderTopLeftRadius: radii.xl,
    height: FOOTER_IMGH,
  })}
`;

export default ImgFooter;
