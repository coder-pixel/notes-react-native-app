import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import NoteList from "@/components/NoteList";
import noteService from "@/services/noteService";
import FullScreenLoader from "@/components/FullScreenLoader";
import AddEditNoteModal from "@/components/AddEditNoteModal";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const NotesScreen = () => {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();

  const [notes, setNotes] = useState<any>([]);
  const [loading, setLoading] = useState({
    fetchLoading: false,
    deleteLoading: false,
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

      const response = await noteService?.getNotes(user?.$id);
      console.log({ response });

      if (response?.error) {
        Alert.alert("Error", response?.error);
        return;
      }

      setNotes(response?.data);
    } catch (err: any) {
      console.log({ err });
      Alert.alert("Error", err);
    } finally {
      _manageLoading("fetchLoading", false);
    }
  };

  const _handleNotesAddSuccesfully = (type: string, data: any, id?: string) => {
    if (type === "add") {
      setNotes((prev: any) => [...prev, data]);
    } else {
      const newNotes = [...notes];

      const noteIdx = newNotes?.findIndex((note) => note?.$id === id);
      if (noteIdx > -1) {
        newNotes[noteIdx] = { ...newNotes[noteIdx], text: data?.text }; // update the note
      }

      setNotes(newNotes);
    }
  };

  const _handleDelete = (noteId: string) => {
    if (!noteId) return;

    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          _manageLoading("deleteLoading", true);
          const response = await noteService.deleteNote(noteId);

          if (response.error) {
            Alert.alert("Error", response.error);
          } else {
            setNotes(notes.filter((note: any) => note.$id !== noteId));
          }
          _manageLoading("deleteLoading", false);
        },
      },
    ]);
  };

  const _handleEdit = (note: any) => {
    _toggleAddEditNoteModal(true, note);
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      _fetchNotes();
    }
  }, [user]);

  if (authLoading) {
    <FullScreenLoader />;
  }

  console.log({ user });
  return (
    <View style={styles?.container}>
      {user ? (
        <View style={styles?.parentCon}>
          <TouchableOpacity style={styles?.logoutButton} onPress={logout}>
            <Text style={styles?.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text>{user?.name || user?.email}</Text>
        </View>
      ) : null}

      {notes?.length ? (
        <>
          <NoteList
            notes={notes}
            onDelete={(noteId: string) => _handleDelete(noteId)}
            onEdit={(note: string) => _handleEdit(note)}
            loading={loading}
          />
        </>
      ) : loading?.fetchLoading ? (
        <FullScreenLoader />
      ) : (
        <Text style={styles?.noNotesText}>No Notes Available</Text>
      )}

      <TouchableOpacity
        style={styles?.addButton}
        onPress={() => _toggleAddEditNoteModal(true)}
      >
        <Text style={styles?.addButtonText}>+ Add</Text>
      </TouchableOpacity>
      {/* Modal */}
      <AddEditNoteModal
        isOpen={addEditNoteModal?.isOpen}
        data={addEditNoteModal?.data}
        toggleModal={_toggleAddEditNoteModal}
        onSuccess={(type: string, data: any, id?: string) =>
          _handleNotesAddSuccesfully(type, data, id)
        }
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
  parentCon: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
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
  logoutButton: {
    marginRight: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#ff3b30",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
