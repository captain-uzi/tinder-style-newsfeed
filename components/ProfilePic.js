import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { useEffect } from "react";
import * as firebase from "firebase";
import "@firebase/storage";
import "@firebase/firestore";
import firebaseConfig from "./Firebase/firebaseConfig";
import { Avatar, Icon, BottomSheet, ListItem } from "react-native-elements";
import Default from "../utils/colors";
import {
  ActivityIndicator,
  Button,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default function ProfilePic({ uid }) {
  const [image, setImage] = useState(null);
  const ref = firebase.storage().ref().child(uid);
  ref.getDownloadURL().then(
    function (url) {
      setImage(url);
    },
    function (error) {
      console.log("No Image");
    }
  );
  const [uploading, setUploading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  // useEffect(async () => {
  //   try {
  //     const permissioncr = await Permissions.getAsync(Permissions.CAMERA_ROLL);
  //     const permissionc = await Permissions.getAsync(Permissions.CAMERA);
  //     if (permissioncr.status !== "granted") {
  //       await Permissions.askAsync(Permissions.CAMERA_ROLL);
  //     }
  //     if (permissionc.status !== "granted") {
  //       await Permissions.askAsync(Permissions.CAMERA);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }, []);

  const changeDp = async (uploadUrl) => {
    // const userRef = firebase.firestore().collection("users").doc(uid);
    // userRef.set(
    //   {
    //     dp: uploadUrl,
    //   },
    //   { merge: true }
    // );
    firestore
      .collection("usernames")
      .where("id", "==", uid)
      .limit(1)
      .get()
      .then((documentSnapshots) => {
        if (documentSnapshots.docs.length > 0) {
          documentSnapshots.forEach((doc) => {
            doc.set(
              {
                dp: uploadUrl,
              },
              { merge: true }
            );
          });
        }
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const _maybeRenderUploadingOverlay = () => {
    if (uploading) {
      return (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      );
    }
  };

  const _maybeRenderImage = () => {
    if (!image) {
      return (
        <Icon
          name="user"
          color={Default.primary}
          type="font-awesome"
          size={250}
        />
      );
    }

    return (
      <Avatar
        rounded
        source={{
          uri: image,
        }}
        size={250}
      />
    );
  };

  const _removePhoto = async () => {
    await deleteImageAsync(uid);
    alert("The Profile Photo has been removed.");
    setImage(null);
  };

  const _takePhoto = async () => {
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to take photo is required!");

      return;
    }
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    _handleImagePicked(pickerResult);
  };

  const _pickImage = async () => {
    // let permissionResult = await ImagePicker.getMediaLibraryPermissionsAsync();
    // if (permissionResult.granted === false) {
    //   alert("Permission to access camera roll is required!");

    //   return;
    // }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });

    _handleImagePicked(pickerResult);
  };

  const _handleImagePicked = async (pickerResult) => {
    try {
      setUploading(true);

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(pickerResult.uri, uid);
        changeDp(uploadUrl);
        setImage(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Upload failed, sorry :(");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 0.7,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 5,
        }}
      >
        {!!image && (
          <TouchableOpacity
            style={{
              alignItems: "center",
            }}
            onPress={_removePhoto}
          >
            <Text
              style={{
                fontSize: 20,
                textAlign: "center",
                color: "#D11A2A",
              }}
            >
              Remove photo
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={{
            alignItems: "center",
            marginTop: 5,
          }}
          onPress={_pickImage}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              color: "#24a0ed",
            }}
          >
            Pick an image from camera roll
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            alignItems: "center",
            marginTop: 5,
            marginBottom: 10,
          }}
          onPress={_takePhoto}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              color: "#24a0ed",
            }}
          >
            Click a Photo
          </Text>
        </TouchableOpacity>

        {_maybeRenderImage()}
        {_maybeRenderUploadingOverlay()}

        <StatusBar barStyle="default" />
      </View>
    </View>
  );
}

async function deleteImageAsync(uid) {
  const ref = firebase.storage().ref().child(uid);
  return await ref.delete();
}

async function uploadImageAsync(uri, uid) {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref().child(uid);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}
