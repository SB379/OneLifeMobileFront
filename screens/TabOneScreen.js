import { StyleSheet, Image, TouchableOpacity, Linking, Touchable } from "react-native";
import { Text, View } from "../components/Themed";
import React, {useState, useEffect} from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { ScrollView } from "react-native-gesture-handler";
import { CurrentRenderContext, useNavigation, useRoute } from "@react-navigation/native";
import * as Location from "expo-location"
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import axios from 'axios';
import Modal from "../components/Modal";
import Ionicons from "@expo/vector-icons/Ionicons";
import fallback from "../assets/images/fallbackExp.png";

export default function TabOneScreen() {

    const [experiences, setExperiences] = useState([]);
    const [location, setLocation] = useState();
    const [user, setUser] = useState([]);
    const [title, setTitle] = useState("")
    // const [modalVisibility, setModalVisibility] = useState(
    //     experiences.reduce((acc, experience) => {
    //       return { ...acc, [experience.id]: false };
    //     }, {})
    // );
    const [selected, setSelected] = React.useState("");
  
    const data = [
      {key:'1',value:'Regenerate'},
    ];

    const openURL = (url) => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err));
    }

    const navigation = useNavigation();

    useEffect(() => {

      const getPermissions = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
  
        if (status === "granted") {
          let currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
          
          //https://onelifemobile.onrender.com/api/experiences
          axios.get('http://localhost:8082/api/experiences', {
            params: {
              // answers: JSON.stringify(answers),
              location: JSON.stringify(currentLocation),
            }
          })
          .then((res) => {
            // console.log(res.data.itinerary);
            setExperiences(res.data.itinerary);
            console.log(res.data.matches);

            axios.get("http://localhost:8082/api/experiences/name", {
              params: {
                matches: JSON.stringify(res.data.matches)
              }
            })
            .then((res) => {
              // console.log(res.data);
              setTitle(res.data);
            })
            .catch(err => {
              console.log(err);
            })

          })
          .catch((err) => {
            console.log("Error from Experiences Screen: " + err);
          });

        } else {
          console.log("Please grant permissions");
        }
      };
  
      getPermissions();

      AsyncStorage.getItem("token", (error, token) => {
        if (error) {
          console.log(error);
        } else {
          setUser(jwtDecode(token));
        }
      });
    }, []);

    

    function findSomethingNew() {
      axios.get('http://localhost:8082/api/experiences', {
            params: {
              // answers: JSON.stringify(answers),
              location: JSON.stringify(location),
            }
          })
          .then((res) => {
            // console.log(res.data.itinerary);
            setExperiences(res.data.itinerary);
            console.log(res.data.matches);

            axios.get("http://localhost:8082/api/experiences/name", {
              params: {
                matches: JSON.stringify(res.data.matches)
              }
            })
            .then((res) => {
              // console.log(res.data);
              setTitle(res.data);
            })
            .catch(err => {
              console.log(err);
            })

          })
          .catch((err) => {
            console.log("Error from Experiences Screen: " + err);
          });
    }


    function handleLogout() {
      // Clear the token from AsyncStorage
      AsyncStorage.removeItem('token')
        .then(() => {
          // Remove the token from the request header
          delete axios.defaults.headers.common['authorization'];
          // Navigate to the desired screen (e.g., login screen)
          navigation.navigate('SignIn');
        })
        .catch((error) => {
          console.log(error);
        });
    }

    function regenerate() {
      console.log("okay so this worked")


      //I want a completely new item for this card
      axios.get("http://localhost:8082/api/experiences/whateverThisRouteEndsUpGettingNamed", {
        params: {
          search: "value"
        }
      })
      .then((res) => {
        //reset the card value
      })

    }

    // function handlePress(id) {
    //   // Make a POST request to the backend API to save the experience to the user's account
    //   axios.post('https://onelifemobile.onrender.com/api/users/saved', {
    //     userId: user.id,
    //     experienceId: id,
    //   })
    //   .then(response => {
    //     if (response.status === 200) {
    //       // Show a success message to the user
    //       console.log('Experience saved successfully!');
    //     } else {
    //       // Show an error message to the user
    //       console.log('Failed to save experience.');
    //     }
    //   })
    //   .catch(error => {
    //     console.error(error);
    //     // Show an error message to the user
    //     console.log('Failed to save experience.');
    //   });
    // }

    function handleURL(experience) {
      const url = `http://maps.apple.com/?q=${encodeURIComponent(experience.name)}`;
      Linking.openURL(url);
    }

    const handleModal = (id) => {
        setModalVisibility((prevState) => ({
          ...prevState,
          [id]: !prevState[id],
        }));
    };      

      const ExperienceCard = ({experience, index, handleURL}) => (
        <View style = {styles.card} key = {index}>
          <TouchableOpacity onPress = {() => handleURL(experience)}>
            {/* <Modal isVisible={modalVisibility[experience.id]} experience = {experience}>
                <Modal.Container>
                    <Modal.Header title= {experience.name}>
                    </Modal.Header>
                    <Modal.Body>
                        <Image style = {styles.modalImg} source={ experience.image_url ? { uri: experience.image_url } : fallback } alt = "expImage"></Image>
                        <View style = {styles.modalLoc}>
                            <Ionicons name = "location-outline"size = {25} color = "#444776"/>
                            <Text style={styles.text}>{experience.address.street}, {experience.address.city}, {experience.address.state} {experience.address.zip}</Text>                                
                        </View>
    
                        <Text>{experience.description}</Text>
    
                        <View style = {styles.buttons}>
                            <TouchableOpacity style = {styles.buttonOutline} onPress = {() => handlePress(experience.id)}>
                                <Ionicons name = "star-outline" size = {25}/>
                            </TouchableOpacity>
                            <TouchableOpacity style = {styles.bookButton} onPress = {() => handleURL(experience)}>
                                <Text style  = {styles.bookButtonText}>Book</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal.Body>
                    <Modal.Footer>
                        <TouchableOpacity style = {styles.modalBack} onPress = {() => handleModal(experience.id)}>
                            <Text style = {styles.backText}>Back to Exploring</Text>
                        </TouchableOpacity>
                    </Modal.Footer>
                </Modal.Container>
            </Modal> */}
            <Image
              style={styles.img}
              source={ experience.image_url ? { uri: experience.image_url } : fallback }
              alt="expImage"
            />
            <View style = {styles.cardText}>
              <View style = {styles.cardTextTitleView}>
                  <Text style = {styles.cardTextTitle}>{experience.name}</Text>
              </View>
              <View style = {styles.cardTextLocationView}>
                  <Text style = {styles.cardTextLocationText}>{experience.address.city}, {experience.address.state}</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* <View style = {styles.pictureButtonView}>
              <TouchableOpacity style = {styles.pictureButton}>
                <Text style = {styles.pictureText}>Capture with OneLife </Text>
                <Ionicons name="camera-outline" size={15} color="white" />
              </TouchableOpacity>
          </View> */}
        </View>
    );

    const Selector = () => (
      <View style  = {styles.selectorView}>
        <SelectList 
        boxStyles={{borderWidth:0, justifyContent: "center", alignItems: "center"}} 
        inputStyles = {{color: "#F4F4FF"}}
        dropdownStyles = {{borderWidth: 0}}
        dropdownTextStyles = {{color: "#F4F4FF"}}
        onSelect={() => regenerate()}
        setSelected={setSelected} 
        data = {data}/>
      </View>
    )

    const Content = ({title, experiences}) => (
        <View style = {styles.contentContainer}>
            <Text style = {styles.contentTitle}>{title}</Text>
            <View style = {styles.scroller}>
                <ScrollView horizontal= {true} contentContainerStyle={styles.cardScroller}>
                {experiences.map((experience, index) => (
                  <View key = {index}>
                    <ExperienceCard
                    experience={experience}
                    handleURL={handleURL}
                    />
                    {/* <Selector/> */}
                  </View>
                ))} 
                </ScrollView>
            </View>
        </View>
    );


    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.titleBox}>
            <Text style={styles.title}>Hey, {user.name}</Text>
            <Text style={styles.subtitle}>I know what we're going to do today</Text>
          </View>
          <View style={styles.content}>
            <Content title={title} experiences={experiences} />
            {/* <Selector/> */}
          </View>
          <View style={styles.bottom}>
            <TouchableOpacity style={styles.bottomButton} onPress={findSomethingNew}>
              <Text style={styles.bookButtonText}>Find Something New</Text>
            </TouchableOpacity>
            <TouchableOpacity style = {styles.logOutButton} onPress = {handleLogout}>
              <Text>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center", 
    backgroundColor: "#F4F4FF"   
  },
  main: {
      marginTop: "12.5%",
      flex: 1,
  },
  titleBox: {
      justifyContent: "flex-start",
      marginLeft: 20,
      marginTop: 5,
  },
  title: {
      fontWeight: "bold",
      fontSize: 32,
      marginBottom: 5,
  },
  subtitle: {
      fontWeight: "500",
      fontSize: 16,
  },
  input: {
      width: 360,
      height: 40,
      borderColor: "#000000",
      borderRadius: 30,
      backgroundColor: "#FFFFFF",
      paddingLeft: 10,
      marginTop: 10,
      marginBottom: 10,
      borderWidth: 1,
  },
  content: {
      justifyContent: "flex-start",
      // alignItems:"center",
      marginTop: "5%",
      marginLeft: 20,
      marginBottom: "10%",
      flex: 1,
  },
  contentContainer: {
      marginBottom: 20,
  },  
  contentTitle: {
      fontWeight: "500",
      fontSize: 24,
      marginBottom: 5,
  },
  scroller: {
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column"
  },
  cardScroller: {
      justifyContent: "center",
      alignItems:"center",
      flexDirection: "row",
      marginBottom: "25%",
      height: "100%",
    },
  card: {
      width: 280,
      // height: 380,
      height: 300,
      borderRadius: 30,
      backgroundColor: "#FFFFFF",
      marginLeft: 10,
      marginRight: 10,
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      // marginBottom: 15,
    },
  cardTextTitleView: {
      height: "25%",
      width: "100%",
      // marginTop: "37.5%",
      backgroundColor: "#FFFFFF",
      alignItems: "flex-start",
      // position: "absolute",
      top: -27.5,
      // bottom: 0,
    },
    cardText: {
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      // height: 200,
      // marginTop: 5,
      // width: 275,
      // borderRadius: 40,
      backgroundColor: "#FFFFFF",
      width: "100%",
      // height: 160,
      // height: "100%",
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
    },
    cardTextTitle: {
      alignItems: "flex-start",
      marginLeft: 10,
      marginTop: 5,
      fontWeight: "500",
      fontSize: 14,
    },
    cardTextLocationView: {
      height: "20%",
      alignItems: "flex-end",
      marginRight: 10,
      // come back to this there's a weird bug with a corner edge on the card
      backgroundColor: "#FFFFFF",
      width: "100%",
      position: "absolute", 
      top: 0 + "30%", //change this back to 25 when this is pushed to prod
      // bottom: 0,
    },
    cardTextLocationText: {
      fontWeight: "500",
      fontSize: 14,
      marginRight: 10,
    },
    img : {
      width: 280,
      height: 240,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    popUpClose: {
      alignItems: "flex-end",
      backgroundColor: "#FFFFFF"
    },
    modalImg: {
      width: "100%",
      height: "65%",
      borderRadius: 30,
    },
    modalLoc: {
      backgroundColor: "#FFFFFF",
      flexDirection: "row",
      alignItems: "center",
    },
    buttons: {
      backgroundColor: "#FFFFFF",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    buttonOutline: {
      // marginTop: 10,
      borderRadius: 25,
      borderColor: "#444776",
      borderWidth: 2,
      padding: 5,
      backgroundColor: "#FFFFFF",
      width: "12.5%",
      marginRight: 5,
      // backgroundColor: "#444776"
    },
    bookButton: {
      backgroundColor: "#FA5150",
      borderRadius: 30,
      width: "85%",
      alignItems: "center",
      justifyContent: "center",
    },
    bookButtonText: {
      color: "#FFFFFF",
      padding: 10,
    },
    modalBack: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#FA5150",
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
      paddingTop: 5,
      height: 50,
    },
    backText: {
      color: "#FFFFFF",
      fontSize: 18,
    },
    bottom: {
      left: "2.5%",
      // bottom: "10%",
      width: "100%",
      height: "15%",
      flexDirection: "row",
      // backgroundColor: "red"
    },
    bottomButton: {
      backgroundColor: "#FA5150",
      borderRadius: 30,
      padding: 10,
      width: "45%",
      height: "50%",
      marginTop: 5,
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    logOutButton: {
      backgroundColor: "#FFFFFF",
      borderRadius: 30,
      width: "20%",
      height: "50%",
      shadowColor: '#171717',
      shadowOffset: {width: -2, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      left: "80%",
      justifyContent: "center",
      alignItems: "center"
    },
    selectorView: {
      top: 20,
      marginLeft: 70,
      width: "50%",
      backgroundColor: "#444776",
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      // color: "#F4F4FF"
    },
    pictureButtonView: {
      bottom: 0,
      position: "absolute",
      width: "100%",
      height: "20%",
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
      backgroundColor: "#FA5150"
    },
    pictureButton: {
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      top: 10,
      flexDirection: "row"
    },
    pictureText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    }
});
