import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { auth, firestore } from "../components/Firebase/firebase";
import navigationTheme from "./navigationTheme";
import AuthStack from "./AuthStack";
import AppStack from "./AppStack";
import { AuthUserContext } from "./AuthUserProvider";
import Spinner from "../components/Spinner";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Routes() {
  const { user, setUser } = useContext(AuthUserContext);
  const [isLoading, setIsLoading] = useState(true);
  const storeData = async (data, authUser) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem("userInfo", jsonValue);
      console.log("send run");
      setUser(authUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = auth.onAuthStateChanged(async (authUser) => {
      try {
        const usersRef = firestore.collection("users");
        await (authUser
          ? storeData((await usersRef.doc(authUser.uid).get()).data(), authUser)
          : setUser(null));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    });

    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
