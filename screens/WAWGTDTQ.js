import React, {useState, useEffect, useRef} from "react";
import { StyleSheet, Image, TouchableOpacity, Touchable, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Text, View } from "../components/Themed";
import { SelectList } from "react-native-dropdown-select-list";
import * as Location from "expo-location"
import axios from 'axios';

export default function WAWGTDTQ() {

  const navigation = useNavigation();
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [location, setLocation] = useState();

  const questions = [
    {
      leftOption: "Work",
      rightOption: "Play",
    },
    {
      leftOption: "Indoors",
      rightOption: "Outdoors",
    },
    {
      leftOption: "Active",
      rightOption: "Not Active",
    },
    {
      leftOption: "Food",
      rightOption: "No Food",
    },
    {
      leftOption: "Drinks",
      rightOption: "No Drinks",
    },
  ];

  function handleOptionPress(option) {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);

    if (currentQuestionIdx === questions.length - 1) {
        return;
    } else {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  }

  function navigationHandler() {
    navigation.navigate("Root", {
      screen: "TabOneScreen",
      params: {
        // answers: answers,
        location: location,
      },
    });
    setAnswers([]);
    setCurrentQuestionIdx(0);
  }
  

  async function logOut() {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem("token");
  
      // Remove the token from the request header
      delete axios.defaults.headers.common["authorization"];
  
      // Perform any additional log out actions or navigation if needed

      //This needs to navigate to sign in screen
      
      navigation.navigate("SignIn");

      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error occurred while logging out:", error);
    }
  }
  

  useEffect(() => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } else {
        console.log("Please grant permissions");
      }
    };

    getPermissions();
  }, []);

//   useEffect(() => {
//     console.log(answers);
//   }, [answers]);

  useFocusEffect(
    React.useCallback(() => {
      if (answers.length === questions.length) {
        navigationHandler();
      }
    }, [answers])
  );

  return (
    <View style={styles.quizContainer}>
      <View style={styles.questionContainer}>
        <Text style={styles.questionTitle}>WTM?</Text>
        {/* <View style={styles.answerSelector}>
          <TouchableOpacity
            style={styles.selectors}
            onPress={() => handleOptionPress(questions[currentQuestionIdx].leftOption)}
          >
            <Text style={styles.selectorText}>{questions[currentQuestionIdx].leftOption}</Text>
          </TouchableOpacity>
          <Text style={styles.or}>or</Text>
          <TouchableOpacity
            style={styles.selectors}
            onPress={() => handleOptionPress(questions[currentQuestionIdx].rightOption)}
          >
            <Text style={styles.selectorText}>{questions[currentQuestionIdx].rightOption}</Text>
          </TouchableOpacity>
          <View style = {styles.selectors}>
            <Text style = {styles.selectorText}>Indoors/Outdoors?</Text>
          </View>
          <View style = {styles.selectors}>
            <Text style = {styles.selectorText}>Food?</Text>
            <SelectList></SelectList>
          </View>
          <View style = {styles.selectors}>
            <Text style = {styles.selectorText}>Drinks?</Text>
          </View>
        </View> */}
        <View style = {styles.answerSelector}>
            <TouchableOpacity style={styles.exitButton} onPress={navigationHandler}>
            <Text style={styles.buttonText}>See Popular Experiences Near Me</Text>
            {/* <Text style = {styles.buttonText}>Log Out</Text> */}
            </TouchableOpacity>
        </View>
      </View>
      {/* <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.exitButton} onPress={navigationHandler}>
          <Text style={styles.buttonText}>See Popular Experiences Near Me</Text>
          <Text style = {styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}
  
  

const styles = StyleSheet.create({
    quizContainer: {
        backgroundColor: "#FA5150",
        width: "100%",
        height: "100%",
        flexDirection: "column",
    },
    questionContainer: {
        backgroundColor: "#FA5150",
        top: "10%",
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        // paddingLeft: 20,
    },
    questionText: {
        color: "#F4F4FF",
        fontWeight: "400",
        fontSize: 28,
        paddingLeft: 20,
    },
    questionTitle: {
        color: "#F4F4FF",
        fontWeight: "700",
        fontSize:48,
        paddingLeft: 20,
        opacity: 0.75,
    },
    bottomContainer: {
        bottom: "10%",
        backgroundColor: "#FA5150",
        alignItems: "flex-end",
        paddingRight: 20,
    },
    exitButton: {
        backgroundColor: "#444776",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        width: "75%",
        borderRadius: 30,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.5,
        shadowRadius: 4,
    },
    buttonText: {
        color: "#F4F4FF",
        fontWeight: "300",
        fontSize: 16,
    },
    answerSelector: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "75%",
        width: "100%",
        backgroundColor: "#FA5150"
    },      
    selectors: {
        height: "30%",
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "center",
        backgroundColor: "#FA5150",
        paddingLeft: 25,
        flexDirection: "row",
        padding: 20,
    },
    selectorText: {
        color: "#F4F4FF",
        fontWeight: "400",
        fontSize: 32,
    },
    or: {
        color:"#000000",
        backgroundColor: "#FA5150",
        fontWeight: "300",
        fontSize: 28,
    }
})  