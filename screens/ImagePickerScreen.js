import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { AssetsSelector } from "expo-images-picker";
import { Ionicons } from "@expo/vector-icons";

const ForceInset = {
  top: "never",
  bottom: "never",
};

export default function ImagePickerScreen({ route, navigation }) {
  const onDone = (data) => {
    //Alert.alert("Selected items are", JSON.stringify(data));
    let durations = data
      .map((obj) => obj.duration)
      .filter((number) => number !== 0);
    console.log(durations);
    console.log(durations);
    if (
      durations.length > 1 ||
      (durations.length === 1 && data.length !== 1) ||
      (durations.length === 1 && durations[0] > 140)
    ) {
      Alert.alert(
        "Only one 140 seconds video file or a maximum of four images can be attached"
      );
    } else {
      // Alert.alert("Selected items are", JSON.stringify(data));
      navigation.navigate({
        name: "Home",
        params: { data: data },
        merge: true,
      });
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView forceInset={ForceInset} style={styles.container}>
      <View style={styles.container}>
        <AssetsSelector
          options={{
            assetsType: ["photo", "video"],
            maxSelections: 4,
            margin: 2,
            portraitCols: 4,
            landscapeCols: 6,
            widgetWidth: 100,
            widgetBgColor: "white",
            videoIcon: {
              Component: Ionicons,
              iconName: "ios-videocam",
              color: "tomato",
              size: 20,
            },
            selectedIcon: {
              Component: Ionicons,
              iconName: "ios-checkmark-circle-outline",
              color: "white",
              bg: "#0eb14970",
              size: 26,
            },
            spinnerColor: "black",
            onError: () => {},
            noAssets: () => <View></View>,
            defaultTopNavigator: {
              continueText: "Finish",
              goBackText: "Back",
              selectedText: "Selected",
              midTextColor: "tomato",
              buttonStyle: _buttonStyle,
              buttonTextStyle: _textStyle,
              backFunction: goBack,
              doneFunction: (data) => onDone(data),
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const _textStyle = {
  color: "white",
};
const _buttonStyle = {
  backgroundColor: "black",
  borderRadius: 18,
};

// if you want to use defaultTopNavigator you must send in basic style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      android: {
        marginTop: StatusBar.currentHeight,
      },
    }),
  },
});
