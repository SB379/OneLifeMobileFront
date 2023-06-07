import { StyleSheet, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "../components/Themed";
import React, {useState, useEffect, useRef} from "react";
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { SvgXml } from 'react-native-svg';
import InstagramLogin from "react-native-instagram-login";
// import Wave from "../assets/waves.svg"

const xml = `<svg id="visual" viewBox="0 0 540 960" width="540" height="960" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="540" height="960" fill="#F4F4FF"></rect><path d="M0 703L12.8 709.8C25.7 716.7 51.3 730.3 77 730.5C102.7 730.7 128.3 717.3 154 721.5C179.7 725.7 205.3 747.3 231.2 763C257 778.7 283 788.3 308.8 783C334.7 777.7 360.3 757.3 386 759.8C411.7 762.3 437.3 787.7 463 793.2C488.7 798.7 514.3 784.3 527.2 777.2L540 770L540 961L527.2 961C514.3 961 488.7 961 463 961C437.3 961 411.7 961 386 961C360.3 961 334.7 961 308.8 961C283 961 257 961 231.2 961C205.3 961 179.7 961 154 961C128.3 961 102.7 961 77 961C51.3 961 25.7 961 12.8 961L0 961Z" fill="#444776"></path><path d="M0 807L12.8 819.2C25.7 831.3 51.3 855.7 77 854.2C102.7 852.7 128.3 825.3 154 821.8C179.7 818.3 205.3 838.7 231.2 852.8C257 867 283 875 308.8 874.5C334.7 874 360.3 865 386 847.3C411.7 829.7 437.3 803.3 463 796.2C488.7 789 514.3 801 527.2 807L540 813L540 961L527.2 961C514.3 961 488.7 961 463 961C437.3 961 411.7 961 386 961C360.3 961 334.7 961 308.8 961C283 961 257 961 231.2 961C205.3 961 179.7 961 154 961C128.3 961 102.7 961 77 961C51.3 961 25.7 961 12.8 961L0 961Z" fill="#fa5150"></path></svg>`;

export default function SignInScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const insRef = useRef();
    const [token, setToken] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        (async ()=>{
          let token = await AsyncStorage.getItem("token",token)
          if(token){
           navigation.navigate("Root");
          }
          else {
           //redirect to login page
          }
        })()
      })

    function handleSubmit(e) { 

        axios.post("https://onelifemobile.onrender.com/api/users/login", {
            email: email,
            password: password,
        })
        .then(function (response) {
            if(response.data.message === "Success")
            {
                // Store the token in AsyncStorage
                AsyncStorage.setItem("token", response.data.token);

                // Add the token to the request header
                axios.defaults.headers.common['authorization'] = response.data.token;

                navigation.navigate("Root");
            }
        })
        .catch(function (err) {
            console.log(err)
        })

    }

    // function handleSubmit(token)
    // {
    //     AsyncStorage.setItem("token", token.access_token);

    //     // Add the token to the request header
    //     axios.defaults.headers.common['authorization'] = token.access_token;

    //     navigation.navigate('Root');
    // }

    return (
        <View style = {styles.container}>
            <View style = {styles.background}>
                <SvgXml xml = {xml} width = "100%" height = "100%" viewBox="0 -90 540 960 "/>
            </View>

            <View style = {styles.titleContainer}>
                    <Text style = {styles.title}>Welcome to OneLife</Text>
                    <View style = {styles.loginContainer}>

                        {/* <TouchableOpacity
                            style={styles.button}
                            onPress={() => insRef.current.show()}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>Login with Instagram</Text>
                        </TouchableOpacity> */}

                        {/* <TouchableOpacity
                            style={[styles.button, { marginTop: 10, backgroundColor: 'green' }]}
                            onPress={onClear}>
                            <Text style={{ color: 'white', textAlign: 'center' }}>Logout</Text>
                        </TouchableOpacity> */}

                        {/* <InstagramLogin
                            ref={insRef}
                            appId='1701782226924899' 
                            appSecret='ad284376dfc7537fd4cf31904b899810'
                            onLoginSuccess={(token) => handleSubmit(token)}
                            scopes={['user_profile', 'user_media']}
                            onLoginFailure={(data) => console.log(data)}
                            redirectUrl="https://www.google.com/"
                        /> */}


                        <View style = {styles.signinTitleContainer}>
                            <Text style = {styles.signinTitle}>Sign In</Text>
                        </View>
                        <TextInput placeholder="Email" placeholderTextColor={"#000000"} style = {styles.input} value = {email} onChangeText = {setEmail} autoCapitalize = {"none"}/>
                        <TextInput placeholder="Password" placeholderTextColor = {"#000000"} style = {styles.input} value = {password} onChangeText = {setPassword} secureTextEntry/>
                        <TouchableOpacity style = {styles.button} onPress = {handleSubmit}>
                            <Text style = {styles.buttonText}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Text style = {styles.forgotPassword}>Forgot your Password?</Text>
                        </TouchableOpacity>

                        <View styles = {styles.loginContainer}>
                            <Text style = {styles.signupTitle}>New to OneLife?</Text>
                            <TouchableOpacity style = {styles.buttonAlt} onPress ={() => {navigation.navigate('SignUp')}}>
                                <Text style = {styles.buttonText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    container: {
        backgroundColor: "#F4F4FF",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: 'center',
    },
    image: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
    },
    titleContainer: {
        position: "absolute",
        top: "10%",
        height: "60%",
        // backgroundColor: "aqua",
    },
    title: {
        fontWeight: "bold",
        fontSize: 32,
    },
    loginContainer: {
        position: "absolute",
        alignItems: "center",
        top: "20%",
        width: "100%"
        //backgroundColor: "red",
    },
    input: {
        borderColor: "#444776",
        borderRadius: 30,
        borderWidth: 1,
        height: 50,
        color: "#000000",
        paddingLeft: 10,
        width: "80%",
        marginBottom: 10,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    signinTitleContainer: {
        width: "80%",
        justifyContent: "flex-start",
        marginBottom: 10,
    },
    signinTitle: {
        fontWeight: "300",
        fontSize: 28,
    },
    signinContainer: {
        height: "25%",
        // backgroundColor: "red"
    },
    button: {
        backgroundColor: "#FA5150",
        width: "80%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    buttonAlt: {
        backgroundColor: "#444776",
        // width: "100%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
        marginTop: 10,
    },
    buttonText: {
        color: "#F4F4FF",
        fontWeight: "500",
        fontSize: 18,
    },
    signupTitle: {
        fontWeight: "300",
        fontSize: 28,
        marginTop: 40,
    }, 
    forgotPassword: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: "300",
        color: "#444776"
    },
});