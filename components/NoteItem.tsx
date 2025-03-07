import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";

type NoteItemProps = {
  note: any;
  onDelete?: any;
  onEdit?: any;
  loading: any;
};
const NoteItem = ({ note, loading, onDelete, onEdit }: NoteItemProps) => {
  return (
    <View style={styles?.noteItem}>
      <Text style={styles?.noteText}>{note?.text}</Text>

      <View
        style={{
          flexDirection: "row",
          gap: 5,
        }}
      >
        {/* edit */}
        <TouchableOpacity
          onPress={() => onEdit(note)}
          disabled={loading?.deleteLoading}
        >
          <Text style={styles.edit}>💾</Text>
        </TouchableOpacity>

        {/* delete */}
        {loading?.deleteLoading ? (
          <ActivityIndicator size="small" color="#007bff" />
        ) : (
          <TouchableOpacity
            onPress={() => onDelete(note?.$id)}
            disabled={loading?.deleteLoading}
          >
            <Text style={styles?.delete}>❌</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default NoteItem;

const styles = StyleSheet?.create({
  noteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  noteText: {
    fontSize: 18,
  },
  delete: {
    fontSize: 14,
    color: "red",
  },
  edit: {
    fontSize: 14,
    marginRight: 10,
    color: "blue",
  },
});
