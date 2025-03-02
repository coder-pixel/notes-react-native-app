import { View, Text, StyleSheet } from "react-native";
import React from "react";

const NoteItem = ({ note }: any) => {
  return (
    <View style={styles?.noteItem}>
      <Text style={styles?.noteText}>{note?.text}</Text>
    </View>
  );
};

export default NoteItem;

const styles = StyleSheet?.create({
  noteItem: {
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  noteText: {
    fontSize: 18,
  },
});
