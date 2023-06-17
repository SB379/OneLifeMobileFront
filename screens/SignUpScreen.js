import { StyleSheet, Image, Button, TouchableOpacity } from "react-native";
import { Text, View } from "../components/Themed";
import React, {useState, useEffect} from "react";
import { TextInput } from "react-native-gesture-handler";
import { SvgXml } from 'react-native-svg';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';

const xml = `<svg id="visual" viewBox="0 0 540 960" width="540" height="960" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"><rect x="0" y="0" width="540" height="960" fill="#F4F4FF"></rect><path d="M0 703L12.8 709.8C25.7 716.7 51.3 730.3 77 730.5C102.7 730.7 128.3 717.3 154 721.5C179.7 725.7 205.3 747.3 231.2 763C257 778.7 283 788.3 308.8 783C334.7 777.7 360.3 757.3 386 759.8C411.7 762.3 437.3 787.7 463 793.2C488.7 798.7 514.3 784.3 527.2 777.2L540 770L540 961L527.2 961C514.3 961 488.7 961 463 961C437.3 961 411.7 961 386 961C360.3 961 334.7 961 308.8 961C283 961 257 961 231.2 961C205.3 961 179.7 961 154 961C128.3 961 102.7 961 77 961C51.3 961 25.7 961 12.8 961L0 961Z" fill="#444776"></path><path d="M0 807L12.8 819.2C25.7 831.3 51.3 855.7 77 854.2C102.7 852.7 128.3 825.3 154 821.8C179.7 818.3 205.3 838.7 231.2 852.8C257 867 283 875 308.8 874.5C334.7 874 360.3 865 386 847.3C411.7 829.7 437.3 803.3 463 796.2C488.7 789 514.3 801 527.2 807L540 813L540 961L527.2 961C514.3 961 488.7 961 463 961C437.3 961 411.7 961 386 961C360.3 961 334.7 961 308.8 961C283 961 257 961 231.2 961C205.3 961 179.7 961 154 961C128.3 961 102.7 961 77 961C51.3 961 25.7 961 12.8 961L0 961Z" fill="#fa5150"></path></svg>`;

export default function SignUpScreen() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [first, setFirst] = useState("");
    const [last, setLast] = useState("");

    const navigation = useNavigation();

    function handleSubmit(e) { 
        
        if(!validateEmail(email))
        {
            //Tell user not a valid email
            console.warn("not a valid email")
        } else {
            if(password !== confirm)
            {
                //Tell user password and confirm aren't equal
                console.warn("Them shits not equal")
            } else {
                axios.post('https://onelifemobile.onrender.com/api/users/register', {
                   firstName: first,
                   lastName: last,
                   email: email,
                   password: password,
                   saved: [],
                })
                .then(function (response) {
                    console.log("didn't fail");
                })
                .catch(function (error) {
                    console.log("failed")
                })
            }
        }

        navigation.navigate("SignIn");
        
    }

    function validateEmail(email){
        var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
 
    return (
        <View style = {styles.container}>
            <View style = {styles.background}>
                <SvgXml xml = {xml} width = "100%" height = "100%" viewBox="0 -90 540 960 "/>
            </View>

            <View style = {styles.titleContainer}>
                <Text style = {styles.title}>
                    Welcome to OneLife
                </Text>
            </View>

            <View style = {styles.signUpContainer}>
                <TextInput placeholder="First Name" placeholderTextColor = {"#000000"} style = {styles.input} value = {first} onChangeText = {setFirst}/>
                <TextInput placeholder="Last Name" placeholderTextColor = {"#000000"} style = {styles.input} value = {last} onChangeText = {setLast}/>
                <TextInput placeholder="Email" placeholderTextColor={"#000000"} style = {styles.input} value = {email} onChangeText = {setEmail} autoCapitalize = {'none'}/>
                <TextInput placeholder="Password" placeholderTextColor={"#000000"} style = {styles.input} value = {password} onChangeText = {setPassword} autoCapitalize = {'none'} secureTextEntry/>
                <TextInput placeholder="Confirm Password" placeholderTextColor={"#000000"} style = {styles.input} value = {confirm} onChangeText = {setConfirm} autoCapitalize = {'none'} secureTextEntry/>

                <TouchableOpacity style = {styles.button} onPress = {handleSubmit}>
                        <Text style = {styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

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
    titleContainer: {
        position: "absolute",
        top: "10%",
        height: "60%",
    },
    title: {
        fontWeight: "bold",
        fontSize: 32,
    },
    signUpContainer: {
        position: "absolute",
        alignItems: "center",
        top: "20%",
        width: "100%",
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
    button: {
        backgroundColor: "#FA5150",
        width: "80%",
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 30,
    },
    buttonText: {
        color: "#F4F4FF",
        fontWeight: "500",
        fontSize: 18,
    },
})