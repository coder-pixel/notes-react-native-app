import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import AddNoteModal from "@/components/AddNoteModal";
import NoteList from "@/components/NoteList";

const NotesScreen = () => {
  const [notes, setNotes] = useState([
    { id: "1", text: "Note One" },
    { id: "2", text: "Note Two" },
    { id: "3", text: "Note Three" },
  ]);

  const [addEditNoteModal, setAddEditNoteModal] = useState({
    isOpen: false,
    data: "",
  });

  const _toggleAddEditNoteModal = (isOpen: boolean = false, data: any = "") => {
    setAddEditNoteModal({ isOpen, data });
  };

  return (
    <View style={styles?.container}>
      <NoteList notes={notes} />
      <TouchableOpacity
        style={styles?.addButton}
        onPress={() => _toggleAddEditNoteModal(true)}
      >
        <Text style={styles?.addButtonText}>+ Add</Text>
      </TouchableOpacity>

      {/* Modal */}
      <AddNoteModal
        isOpen={addEditNoteModal?.isOpen}
        data={addEditNoteModal?.data}
        toggleModal={_toggleAddEditNoteModal}
      />
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
  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  noNotesText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
    marginTop: 15,
  },
});
