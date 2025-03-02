import { View, Text, StyleSheet } from "react-native";
import React from "react";

const NotesScreen = () => {
  return (
    <View style={styles?.container}>
      <Text>Notes</Text>
    </View>
  );
};

export default NotesScreen;

const styles = StyleSheet?.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
});
