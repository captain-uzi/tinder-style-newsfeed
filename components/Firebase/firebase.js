import React from "react";
import styled from "styled-components";

import images from "../../screens/Themes/Images";
import Image from "../../utils/Image";
import Text from "../../utils/Text";
const Avatar = ({ userInfo }) => {
  return (
    <Container>
      <Box>
        <Image avatar source={userInfo.dp} />
      </Box>
      <Text title1>{userInfo.name}</Text>
      <Text>{userInfo.username}</Text>
      <Text>
        Clout {userInfo.clout}dB with {userInfo.mentions} mentions
      </Text>
    </Container>
  );
};

const Container = styled.View`
  align-self: center;
  align-items: center;
  position: absolute;
  top: -35px;
`;

const Box = styled.View`
  ${({ theme: { space } }) => ({
    marginBottom: space.s1,
  })}
`;

export default Avatar;
