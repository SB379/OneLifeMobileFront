import { useEffect, useState, useCallback } from "react";
import { StyleSheet, Image, RefreshControl, ScrollView, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from 'axios';
import { Text, View } from "../components/Themed";
import { TouchableOpacity } from "react-native-gesture-handler";
import Modal from "../components/Modal";
import fallback from "../assets/images/fallbackExp.png"

export default function TabTwoScreen() {
  const [user, setUser] = useState([]);
  const [saved, setSaved] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [allExperiences, setAllExperiences] = useState([]);
  const [modalVisibility, setModalVisibility] = useState(
    allExperiences.reduce((acc, experience) => {
      return { ...acc, [experience._id]: false };
    }, {})
  );


  useEffect(() => {
    AsyncStorage.getItem("token", async (error, token) => {
      if (error) {
        console.log(error);
      } else {
        const user = jwtDecode(token);
        setUser(user);
        try {
          // Fetch the user object from the database
          const response = await axios.get(`https://onelifemobile.onrender.com/api/users/${user.id}`);
          const userData = response.data;
          // Get the saved experiences from the user object
          const savedExperiences = userData.saved;
          setSaved(savedExperiences);
        } catch (error) {
          console.error(error);
          setSaved([]);
        }
      }
    });

    axios.get(`https://onelifemobile.onrender.com/api/experiences`)
    .then((response) => {
      setAllExperiences(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
    
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Fetch the latest data from the server and update the front-end
    axios.get(`https://onelifemobile.onrender.com/api/users/${user.id}`)
      .then(response => {
        // Update the front-end with the latest data
        setSaved(response.data.saved);
        setRefreshing(false);
      })
      .catch(error => {
        console.error(error);
        // Show an error message to the user
        console.log('Failed to refresh data.');
        setRefreshing(false);
      });
  }, []);


  function handleURL(experience) {
    const url = `http://maps.apple.com/?q=${encodeURIComponent(experience.name)}`;
    Linking.openURL(url);
  }
  

  function handleDelete(experienceId) {
    // Make a DELETE request to the backend API to delete the experience from the user's account
    axios.delete(`https://onelifemobile.onrender.com/api/users/unsaved/${user.id}/${experienceId}`)
      .then(response => {
        if (response.status === 200) {
          // Show a success message to the user
          console.log('Experience deleted successfully!');
          // Refresh the front-end data
          refreshData();
        } else {
          // Show an error message to the user
          console.log('Failed to delete experience.');
        }
      })
      .catch(error => {
        console.error(error);
        // Show an error message to the user
        console.log('Failed to delete experience.');
      });
  }
  

  function refreshData() {
    // Fetch the latest data from the server and update the front-end
    axios.get(`https://onelifemobile.onrender.com/api/users/${user.id}`)
      .then(response => {
        // Update the front-end with the latest data
        setSaved(response.data.saved);
      })
      .catch(error => {
        console.error(error);
        // Show an error message to the user
        console.log('Failed to refresh data.');
      });
  }
  
  
  

  const handleModal = (id) => {
    setModalVisibility((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  
  

  const SavedCard = ({experience}) => (
        <View style = {styles.cardContainer}>
          <View style = {styles.cardText}>
            <View style = {styles.cardTop}>
              <Text style = {styles.cardTitle}>{experience.name}</Text>
            </View>
            <View style = {styles.cardBottom}>
              <Modal isVisible = {modalVisibility[experience._id]} experience = {experience}>
                <Modal.Container>
                  <Modal.Header title= {experience.name}>
                      </Modal.Header>
                      <Modal.Body>
                          <Image style = {styles.modalImg} source={ experience.image_url ? { uri: experience.image_url } : fallback } alt = "expImage"></Image>
                          <View style = {styles.modalLoc}>
                              <Ionicons name = "location-outline"size = {25} color = "#444776"/>
                              <Text style={styles.text}>{experience.address[0].street}, {experience.address[0].city}, {experience.address[0].state} {experience.address[0].zip}</Text>                                
                          </View>
      
                          <Text>{experience.description}</Text>
                          <TouchableOpacity style = {styles.bookButton} onPress = {() => handleURL(experience)}>
                              <Text style  = {styles.bookButtonText}>Book</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(experience._id)}>
                              <Text style={styles.bookButtonText}>Delete</Text>
                          </TouchableOpacity>

                      </Modal.Body>
                      <Modal.Footer>
                        <View style = {styles.backContainer}>
                          <TouchableOpacity style = {styles.modalBack} onPress = {() => handleModal(experience._id)}>
                              <Text style = {styles.backText}>Back to Exploring</Text>
                          </TouchableOpacity>
                        </View>
                      </Modal.Footer>
                </Modal.Container>
              </Modal>

              <TouchableOpacity style = {styles.bottomPressable} onPress = {() => handleModal(experience._id)}>
                <Ionicons name = "open-outline" size = {15} color = {"#FA5150"}/>
                <Text style = {styles.cardSubtitle}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style = {styles.imgContainer}>
            <Image style = {styles.cardImg} source={ experience.image_url ? { uri: experience.image_url } : fallback } alt = "expImage"></Image>
          </View>
      </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    }>
    {saved.map((experience, index) => {
      const experienceId = experience;
      // find the experience data from the allExperiences state
      const experienceData = allExperiences.find((data) => data._id === experienceId);
      if (experienceData) {
        return <SavedCard key={index} experience={experienceData} />;
      } else {
        return null;
      }
    })}
  </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: '#F4F4FF',
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  cardContainer: {
    width: "90%",
    height: "10%",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    display: "flex",
    flexDirection: "row",
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginBottom: 20,
    marginTop: 10,
  },
  cardText: {
    width: "75%",
    height: "100%",
    flexDirection: "column",
  },
  cardTop: {
    backgroundColor: "#444776",
    height: "50%",
    width: "100%",
    borderTopLeftRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardBottom: {
    backgroundColor: "#F4F4FF",
    height: "50%",
    width: "100%", 
    borderBottomLeftRadius: 30,
  },
  bottomPressable: {
    width: "100%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  cardTitle: {
    color: "#F4F4FF",
    fontWeight: "400",
    fontSize: 18,
  },  
  cardSubtitle: {
    color: "#FA5150",
    fontWeight: "400",
    fontSize: 16,
  },
  imgContainer: {
    width: "25%",
    height: "100%",
  }, 
  cardImg: {
    width: "100%",
    height: "100%",
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
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
    width: "100%",
    backgroundColor: "#222222"
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
  },
  bookButton: {
    backgroundColor: "#FA5150",
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  bookButtonText: {
    color: "#FFFFFF",
    padding: 10,
  },
  deleteButton: {
    backgroundColor: "#444776",
    borderRadius: 30,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
  backContainer: {
    width: "100%",
    backgroundColor: "#FA5150",
  },
});
