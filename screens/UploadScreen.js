import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  Text,
  Alert,
  Pressable,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { ref as dbRef, set } from "firebase/database";
import { storage, database } from "../database/CompDataBase"; // Update the path as necessary
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

export default function CameraScreen({ navigation }) {
  const [Camera, setCamera] = useState(true);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationLink, setLocationLink] = useState("");

  // permission for photo
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera permissions to make this work!");
        }
      }
    })();
  }, []);

  // permission for camera
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
      setLocationLink(link);
    })();
  }, []);

  const openCamera = async () => {
    // code for start camera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setCamera(false);
    }

    Alert.alert(
      "Auto Location capture",
      "Your current location are automatically extracted so do not need map or anything, do not be hesitate"
    );
  };

  const uploadImage = async () => {
    if (image == null) {
      alert("Please select an image first");
      return;
    }

    setUploading(true);
    setImage(null);
    const response = await fetch(image);
    const blob = await response.blob();

    const storageRef = ref(storage, `images/${Date.now()}`);
    await uploadBytes(storageRef, blob)
      .then(async (snapshot) => {
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Save the download URL to Firebase Realtime Database
        const imageRef = dbRef(database, "images/" + Date.now());
        await set(imageRef, { url: downloadURL, locatinURL: locationLink });

        console.log(locationLink);
        setUploading(false);
        Alert.alert(
          "successfully ✅",
          "Image & Location uploaded successfully!"
        );
        setImage(null); // Reset the image
        navigation.goBack();
      })
      .catch((error) => {
        console.error("Error uploading image: ", error);
        setUploading(false);
      });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {Camera && (
        <Pressable style={styles.PresBtn} onPress={openCamera}>
          <Text style={{ color: "white" }}>Tap to open Camera & Location</Text>
        </Pressable>
      )}

      {image && (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 5,
            elevation: 3,
            width: "80%",
            padding: 20,
            backgroundColor: "white",
            borderRadius: 10,
          }}
        >
          <View style={{ borderWidth: 5, borderRadius: 5, margin: 10 }}>
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          </View>

          <Pressable
            style={{
              width: "100%",
              borderRadius: 100,
              backgroundColor: "black",
              padding: 10,
              alignItems: "center",
            }}
            onPress={uploadImage}
          >
            <Text style={{ color: "white" }}>Upload Image & Locations</Text>
          </Pressable>
        </View>
      )}
      {uploading && (
        <Text style={{ fontWeight: "bold" }}>Uploading... please wait</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  PresBtn: {
    width: "80%",
    borderRadius: 100,
    backgroundColor: "black",
    padding: 10,
    alignItems: "center",
  },
});
