// If you are not familiar with React Navigation, check out the "Fundamentals" guide:
// https://reactnavigation.org/docs/getting-started
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import SignInScreen from "../screens/SignInScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import BottomTabNavigator from "./BottomTabNavigator";
import LinkingConfiguration from "./LinkingConfiguration";
import SignUpScreen from "../screens/SignUpScreen";
import WAWGTDTQ from "../screens/WAWGTDTQ";
import TabOneScreen from "../screens/TabOneScreen";

export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      // theme={colorScheme === "light" ? DefaultTheme : DarkTheme}
    >
      <RootNavigator/>
    </NavigationContainer>
  );
}


// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {

  const [isSignedIn, setIsSignedIn] = useState(false);
  const navigation = useNavigation();

  const getIsSignedIn = () => {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem("token", (error, token) => {
        if (error) {
          reject(error);
        } else {
          resolve(Boolean(token));
        }
      });
    });
  };

  useEffect(() => {
    const checkIsSignedIn = async () => {
      try {
        const signedIn = await getIsSignedIn();
        setIsSignedIn(signedIn);
  
        if (signedIn) {
          navigation.navigate("Root");
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    checkIsSignedIn();
  }, []);
  
  

  if (!isSignedIn) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Root" component={TabOneScreen} />
        <Stack.Screen
          name="NotFound"
          component={NotFoundScreen}
          options={{ title: "Oops!" }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={TabOneScreen} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />

      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}