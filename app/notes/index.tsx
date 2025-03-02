import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import AddNoteModal from "@/components/AddNoteModal";
import NoteList from "@/components/NoteList";
import noteService from "@/services/noteService";
import FullScreenLoader from "@/components/FullScreenLoader";

const NotesScreen = () => {
  const [notes, setNotes] = useState<any>([]);
  const [loading, setLoading] = useState({
    fetchLoading: false,
  });

  const [addEditNoteModal, setAddEditNoteModal] = useState({
    isOpen: false,
    data: "",
  });

  const _toggleAddEditNoteModal = (isOpen: boolean = false, data: any = "") => {
    setAddEditNoteModal({ isOpen, data });
  };

  const _manageLoading = (key: string, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const _fetchNotes = async () => {
    try {
      _manageLoading("fetchLoading", true);

      const response = await noteService?.getNotes();

      console.log({ response });
      setNotes(response?.data);
    } catch (err: any) {
      console.log({ err });
      Alert.alert("Error", err);
    } finally {
      _manageLoading("fetchLoading", false);
    }
  };

  useEffect(() => {
    _fetchNotes();
  }, []);

  return (
    <View style={styles?.container}>
      {notes?.length ? (
        <>
          <NoteList notes={notes} />
          <TouchableOpacity
            style={styles?.addButton}
            onPress={() => _toggleAddEditNoteModal(true)}
          >
            <Text style={styles?.addButtonText}>+ Add</Text>
          </TouchableOpacity>
        </>
      ) : loading?.fetchLoading ? (
        <FullScreenLoader />
      ) : null}

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
