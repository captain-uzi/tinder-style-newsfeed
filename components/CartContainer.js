import React, { useState } from "react";
import { Text, View } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { clamp, snapPoint } from "react-native-redash";
import styled from "styled-components";
import theme from "../utils/theme";
import calendar from "../utils/calendar";
import Default from "../utils/colors";
// import FocusAwareStatusBar from '../../FocusAwareStatusBar';

const { CELL_NUM, CART_HEIGHT, CART_MIN_HEIGHT, width } = calendar;

const snapPoints = [-(CART_HEIGHT - CART_MIN_HEIGHT), 0];

const CartContainer = ({ children, CheckOutComponent }) => {
  const translateY = useSharedValue(0);
  // const [covering, setCovering] = useState(true);
  function changeFromCheckOut() {
    translateY.value = withSpring(0);
    //setCovering(false);
  }
  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      translateY.value = clamp(
        ctx.startY + event.translationY,
        snapPoints[0],
        snapPoints[1]
      );
    },
    onEnd: (event) => {
      const dest = snapPoint(translateY.value, event.velocityY, snapPoints);
      // if (dest === 0) {
      //   if (covering === false) setCovering(true);
      // } else {
      //   if (covering === true) setCovering(false);
      // }
      translateY.value = withSpring(dest, { velocity: event.velocityY });
    },
  });

  const stylez = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Container>
      <CheckOutComponent
        topHeight={CART_MIN_HEIGHT}
        onChange={changeFromCheckOut}
      />
      <PanGestureHandler
        onGestureEvent={gestureHandler}
        hitSlop={{ bottom: 0, height: 40 }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: Default.white,
              borderBottomLeftRadius: CELL_NUM,
              borderBottomRightRadius: CELL_NUM,
              position: "absolute",
              left: 0,
              right: 0,
              height: CART_HEIGHT,
              top: 0,
            },
            stylez,
          ]}
        >
          {children}
          <Knob />
        </Animated.View>
      </PanGestureHandler>
      {/* <View
        style={{
          flex: 1,
          backgroundColor: "#eb3345",
          justifyContent: "flex-end",
        }}
      >
        <Tabbar />
      </View> */}
      {/* <FocusAwareStatusBar style="light" /> */}
    </Container>
  );
};

const Container = styled.View`
  flex: 1;
`;

const Knob = styled.View`
  align-self: center;
  justify-content: flex-end;
  position: absolute;
  width: ${width * 0.18}px;
  height: 5px;

  ${({ theme: { space, radii } }) => ({
    backgroundColor: "#6e6869",
    borderRadius: 4,
    bottom: 18,
  })}
`;

export default CartContainer;
