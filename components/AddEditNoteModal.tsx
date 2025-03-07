import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput } from "react-native";
import noteService from "@/services/noteService";

interface AddNoteModalProps {
  isOpen: boolean;
  data?: any;
  toggleModal: () => void;
  onSuccess: any;
}

const AddEditNoteModal = ({
  isOpen,
  data,
  toggleModal,
  onSuccess,
}: AddNoteModalProps) => {
  const [formFields, setFormFields] = useState<Record<string, string>>({
    note: "",
  });
  const [isDirty, setIsDirty] = useState<Record<string, boolean>>({
    note: false,
  });
  const [errors, setErrors] = useState<Record<string, null | string>>({
    note: null,
  });

  const [loading, setLoading] = useState({
    fetchLoading: false,
    submitLoading: false,
  });

  const _manageLoading = (key: string, value: boolean) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const _onClose = () => {
    setFormFields({
      note: "",
    });
    setErrors({
      note: "",
    });
    setIsDirty({
      note: false,
    });

    toggleModal();
  };

  const _handleOnChange = (key: string, noteValue: string) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[key] = noteValue;
    newIsDirty[key] = true;

    setFormFields(newFormFields);
    setIsDirty(newIsDirty);

    _validateFormFields({ newFormFields, newIsDirty });
  };

  const _validateFormFields = ({
    newFormFields,
    newIsDirty,
  }: {
    newFormFields: any;
    newIsDirty: any;
  }) => {
    return new Promise((resolve) => {
      const newErrors = { ...errors };
      let isFormValid = true;

      Object.keys(formFields)?.forEach((key) => {
        if (newIsDirty?.[key]) {
          switch (key) {
            case "note": {
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors[key] = "*Required";
                newIsDirty[key] = false;
                isFormValid = false;
              } else {
                newErrors[key] = null;
              }
              break;
            }

            default:
          }
        }
      });

      setIsDirty(newIsDirty);
      setErrors(newErrors);

      resolve(isFormValid);
    });
  };

  const _onSubmit = async () => {
    let res;
    try {
      _manageLoading("submitLoading", true);
      const newFormFields = { ...formFields };
      const newIsDirty = { note: true };

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      if (!isFormValid) {
        Alert.alert("Error", "Note cannot be empty");
        return;
      }

      // make api call here
      const payload = newFormFields?.note || "";
      console.log({ payload });

      if (data) {
        // update call
        res = await noteService?.updateNote(data?.$id, payload);
      } else {
        // create call
        res = await noteService?.addNote(payload);
      }

      console.log({ res });
      if (!res?.error) {
        onSuccess(
          `${data ? "update" : "add"}`,
          res?.data!,
          data ? data?.$id : null
        );
      }
      _onClose();
    } catch (err) {
      console.log({ err });
      Alert?.alert("Error", res?.error);
    } finally {
      _manageLoading("submitLoading", false);
    }
  };

  const _setFormData = (data: any) => {
    console.log({ data });
    const newFormFields = { ...formFields };

    newFormFields["note"] = data?.text || "";

    setFormFields(newFormFields);
  };

  useEffect(() => {
    if (isOpen && data) {
      _setFormData(data);
    }
  }, [isOpen, data]);

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={() => _onClose()}
    >
      <View style={styles?.modalOverlay}>
        <View style={styles?.modalContent}>
          <Text style={styles?.modalTitle}>{data ? "Update" : "Add"} Note</Text>
          <TextInput
            style={styles?.input}
            placeholder="Enter note..."
            placeholderTextColor="#aaa"
            value={formFields?.note}
            onChangeText={(value) => _handleOnChange("note", value)}
          />
          {errors?.["note"] ? (
            <Text style={styles?.errorText}>{errors?.["note"]}</Text>
          ) : null}
          <Text></Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => _onClose()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={_onSubmit}
              disabled={loading?.submitLoading}
            >
              <Text style={styles.saveButtonText}>
                {data ? "Update" : "Save"}{" "}
                {loading?.submitLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : null}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddEditNoteModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#333",
  },
  saveButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});
