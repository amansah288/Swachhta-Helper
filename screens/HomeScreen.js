import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { database } from "../database/CompDataBase";
import { list } from "firebase/storage";
import { ref, set, update, onValue, remove, get } from "firebase/database";

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const dbRef = ref(database, "images/");

    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const fetchedData = snapshot.val();
        setData(fetchedData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data: ", error);
        setError(error);
        setLoading(false);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  // this code for touch a location and get open a G-map link
  const handleLinkPress = (url) => {
    Linking.openURL(url).catch((err) =>
      Alert.alert("G-Map does not exist", err)
    );
  };

  return (
    <View style={styles.container}>
      {/* Welcome word */}
      <View style={{ flexDirection: "row", margin: 10 }}>
        <View
          style={{
            marginTop: 40,
            marginLeft: 10,
            backgroundColor: "black",
            padding: 10,
            borderRadius: 100,

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 20, color: "white" }}>
            Welcome
          </Text>
        </View>
      </View>

      {/* scroll data show firebase data */}
      <View
        style={{
          height: "80%",
          margin: 10,
          flex: 1,
        }}
      >
        <ScrollView
          style={styles.ScrollPage}
          contentContainerStyle={styles.ScrollInside}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.containerss}>
            {Object.entries(data).map(([key, value]) => (
              <View key={key} style={styles.item}>
                <Image
                  style={{
                    height: 200,
                    width: 200,
                    borderWidth: 3,
                    borderColor: "black",
                  }}
                  source={{ uri: value.url }}
                />
                <TouchableOpacity
                  onPress={() => handleLinkPress(value.locatinURL)}
                  style={styles.TouchOpacity}
                >
                  <Text style={{ color: "white" }}>Get Location</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* upload button */}
      <View style={{ alignItems: "center", marginBottom: 50 }}>
        <Pressable
          style={{
            width: "80%",
            borderRadius: 100,
            backgroundColor: "black",
            padding: 10,
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("Upload")}
        >
          <Text style={{ color: "white" }}>Upload</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  ScrollPage: {
    padding: 10,
    flex: 1,
    backgroundColor: "#EEEEEE",
  },
  ScrollInside: { alignItems: "center", justifyContent: "center" },
  containerss: {
    justifyContent: "center",
    alignItems: "center",
  },
  item: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
  TouchOpacity: {
    width: "80%",
    borderRadius: 100,
    backgroundColor: "black",
    padding: 10,
    alignItems: "center",
    marginTop: 20,
  },
});
