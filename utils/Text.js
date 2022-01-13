import styled, { css } from "styled-components";
import { Platform } from "react-native";
import Default from "../utils/colors";
export const isIos = Platform.OS === "ios";
const fonts = {
  ios: ["Proxima-Nova-Bold", "Proxima-Nova-Sbold", "Proxima-Nova-Reg"],
  android: ["Montserrat-Bold", "Montserrat-SemiBold", "Montserrat-Regular"],
};

const headingStyle = css`
  text-align: center;
  line-height: 80px;

  ${({ theme: { colors, size, getFont } }) => ({
    fontSize: 70,
    color: Default.white,
    opacity: 0.9,
  })};
`;

const title1Style = css`
  ${({ theme: { colors, size, getFont } }) => ({
    fontSize: 21,
    color: Default.text,
  })};
`;

const title2Style = css`
  ${({ theme: { colors, size, getFont } }) => ({
    fontSize: 27,
    color: Default.text,
  })};
`;

const title3Style = css`
  ${({ white, theme: { colors, size, getFont } }) => ({
    fontSize: 18,
    color: white ? Default.white : Default.text,
  })};
`;

const bodyStyle = css`
  line-height: 20px;

  ${({ theme: { space } }) => ({
    marginTop: space.xs,
  })}
`;

const buttonStyle = css`
  text-align: center;
  text-transform: capitalize;

  ${({ primary, theme: { Default, getFont, size } }) => ({
    color: primary ? "#ffffff" : "rgba(15, 8, 62, 0.65)",
    // fontFamily: isIos ? fonts.ios[1] : fonts.android[1],
    fontSize: 14,
  })};
`;

const captionStyle = css`
  line-height: 24px;

  ${({ upper, white, theme: { getFont, colors, size } }) => ({
    fontSize: 12,
    color: white ? Default.white : Default.text2,
    textTransform: upper ? "uppercase" : "none",
  })}
`;

const centerStyle = css`
  text-align: center;
`;

const mtpStyle = css`
  ${({ theme: { space } }) => ({
    marginTop: 12,
  })}
`;

const mbtStyle = css`
  ${({ theme: { space } }) => ({
    marginBottom: 4,
  })}
`;

const Text = styled.Text`
  ${({ theme: { colors, size, getFont } }) => ({
    color: "rgba(15, 8, 62, 0.65)",
    fontSize: 15,
    //fontFamily: isIos ? fonts.ios[2] : fonts.android[2],
  })}

  ${({ body }) => body && bodyStyle}
  ${({ button }) => button && buttonStyle};
  ${({ caption }) => caption && captionStyle};
  ${({ heading }) => heading && headingStyle}
  ${({ title1 }) => title1 && title1Style};
  ${({ title2 }) => title2 && title2Style}
  ${({ title3 }) => title3 && title3Style}

  /* position style */
  ${({ center }) => center && centerStyle}
  ${({ mtp }) => mtp && mtpStyle};
  ${({ mbt }) => mbt && mbtStyle};

  ${({ opacity }) => ({ opacity })};
`;

export default Text;
