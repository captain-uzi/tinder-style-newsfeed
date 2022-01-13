import React from "react";
import PropTypes from "prop-types";
import { Text, View, Image, StyleSheet } from "react-native";

const _cardStyle = (backgroundColor) => ({
  width: 250,
  height: 350,
  backgroundColor,
  borderRadius: 300,
  marginRight: "auto",
  alignItems: "center",
});

const ImagedCard = (props) => {
  const {
    stars,
    descText,
    starColor,
    titleText,
    regionText,
    imageSource,
    dividerStyle,
    subregionText,
    descTextStyle,
    titleTextStyle,
    backgroundColor,
    regionTextStyle,
    subregionTextStyle,
  } = props;

  const renderContentContainer = () => (
    <View>
      <Text style={titleTextStyle || styles.titleTextStyle}>{titleText}</Text>
      <View style={styles.descContainer}>
        <Text style={descTextStyle || styles.descTextStyle}>{descText}</Text>
      </View>
    </View>
  );

  const renderTopTitleContainer = () => (
    <View style={styles.topTitleContainer}>
      <Text style={regionTextStyle || styles.regionTextStyle}>
        {regionText}
      </Text>
      <Text style={dividerStyle || styles.dividerStyle}>|</Text>
      <Text style={subregionTextStyle || styles.subregionTextStyle}>
        {subregionText}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Image
        source={imageSource}
        resizeMode="contain"
        style={styles.imageStyle}
      />
      <View style={_cardStyle(backgroundColor)}>
        <View style={styles.cardContainerGlue}>
          {renderTopTitleContainer()}
          {renderContentContainer()}
        </View>
      </View>
    </View>
  );
};

ImagedCard.propTypes = {
  stars: PropTypes.number,
  descText: PropTypes.string,
  titleText: PropTypes.string,
  starColor: PropTypes.string,
  regionText: PropTypes.string,
  subregionText: PropTypes.string,
  backgroundColor: PropTypes.string,
};

ImagedCard.defaultProps = {
  stars: 5,
  starColor: "#e58450",
  regionText: "Alaskan",
  subregionText: "350g",
  titleText: "Pine Nut",
  backgroundColor: "#fffae8",
  descText: "Pine nut, also known as Castanea mollissima ...",
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "transparent",
  },
  imageStyle: {
    left: 40,
    top: -72,
    width: 200,
    height: 200,
    zIndex: 9999,
    position: "absolute",
  },
  cardContainerGlue: {
    left: 36,
    top: "30%",
    marginRight: "auto",
  },
  starContainer: {
    flexDirection: "row",
  },
  topTitleContainer: {
    marginTop: 12,
    flexDirection: "row",
  },
  regionTextStyle: {
    fontSize: 13,
    color: "#bfb799",
    fontWeight: "600",
  },
  dividerStyle: {
    fontSize: 13,
    paddingLeft: 16,
    paddingRight: 16,
    color: "#bfb799",
    fontWeight: "600",
  },
  subregionTextStyle: {
    fontSize: 13,
    color: "#bfb799",
    fontWeight: "600",
  },
  titleTextStyle: {
    fontSize: 28,
    marginTop: 12,
    fontWeight: "bold",
  },
  descContainer: {
    width: "95%",
    marginTop: 52,
  },
  descTextStyle: {
    fontSize: 14,
    color: "#bababa",
    fontWeight: "600",
  },
});

export default ImagedCard;
