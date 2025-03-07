import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

const initialFormFields = {
  email: "",
  password: "",
  confirmPassword: "",
};
const intialIsDirty = {
  email: false,
  password: false,
  confirmPassword: false,
};

const AuthScreen = () => {
  const router = useRouter();
  const { login, register } = useAuth();

  const [formFields, setFormFields] = useState<any>(initialFormFields);
  const [isDirty, setIsDirty] = useState<any>(intialIsDirty);
  const [errors, setErrors] = useState<any>({});
  const [isRegistering, setIsRegistering] = useState(false);

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const _handleShowPassword = (key: string) => {
    setShowPassword((prev: any) => ({ ...prev, [key]: !prev[key] }));
  };

  const [loading, setLoading] = useState({
    submitLoading: false,
  });

  const _manageLoading = (key: string, value: boolean) => {
    setLoading((prevLoading) => ({ ...prevLoading, [key]: value }));
  };

  const _handleOnChange = (key: string, value: string) => {
    const newFormFields = { ...formFields };
    const newIsDirty = { ...isDirty };

    newFormFields[key] = value;
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
    console.log({ newFormFields, newIsDirty });
    return new Promise((resolve) => {
      const newErrors: any = {};
      let isFormValid = true;

      Object.keys(newFormFields)?.forEach((key) => {
        if (newIsDirty?.[key]) {
          switch (key) {
            case "email": {
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors[key] = "*Email is required"; // TODO: add regex
                isFormValid = false;
              } else {
                newErrors[key] = "";
                newIsDirty[key] = false;
              }
              break;
            }

            case "password": {
              if (!newFormFields?.[key]?.trim()?.length) {
                newErrors[key] = "*Password is required"; // TODO: add regex
                isFormValid = false;
              } else {
                newErrors[key] = "";
                newIsDirty[key] = false;
              }
              break;
            }

            case "confirmPassword": {
              if (
                isRegistering &&
                newFormFields?.["password"]?.trim() !==
                  newFormFields?.[key]?.trim()
              ) {
                newErrors[key] = "*Passwords do not match";
                isFormValid = false;
              } else {
                newErrors[key] = "";
                newIsDirty[key] = false;
              }
              break;
            }

            default:
          }
        }
      });

      setErrors((prev: any) => ({ ...prev, ...newErrors }));
      setIsDirty(newIsDirty);

      resolve(isFormValid);
    });
  };

  const _handleAuth = async () => {
    try {
      _manageLoading("submitLoading", true);

      const newFormFields = { ...formFields };
      const newIsDirty = {
        email: true,
        password: true,
        confirmPassword: isRegistering ? true : false,
      };

      const isFormValid = await _validateFormFields({
        newFormFields,
        newIsDirty,
      });

      if (!isFormValid) {
        _manageLoading("submitLoading", false);
        return;
      }

      let response;

      if (isRegistering) {
        console.log("register");
        response = await register(
          newFormFields?.email,
          newFormFields?.password
        );
      } else {
        console.log("login");
        response = await login(newFormFields?.email, newFormFields?.password);
      }

      if (response?.error) {
        Alert.alert("Error", response?.error);
        _manageLoading("submitLoading", false);
        return;
      }

      router.replace("/notes");
    } catch (err) {
      console.log({ err });
    } finally {
      _manageLoading("submitLoading", false);
    }
  };

  console.log({ errors });
  return (
    <View style={styles?.container}>
      <Text style={styles.header}>{isRegistering ? "Sign Up" : "Login"}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={formFields?.email}
        onChangeText={(value) => _handleOnChange("email", value)}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      {errors?.["email"] ? (
        <Text style={styles?.error}>{errors?.["email"]}</Text>
      ) : null}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={formFields?.password}
        onChangeText={(value) => _handleOnChange("password", value)}
        secureTextEntry
        textContentType="none"
      />

      {errors?.["password"] ? (
        <Text style={styles?.error}>{errors?.["password"]}</Text>
      ) : null}
      {isRegistering && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#aaa"
            value={formFields?.confirmPassword}
            onChangeText={(value) => _handleOnChange("confirmPassword", value)}
            secureTextEntry
            textContentType="none"
          />
          {errors?.["confirmPassword"] ? (
            <Text style={styles?.error}>{errors?.["confirmPassword"]}</Text>
          ) : null}
        </>
      )}
      <TouchableOpacity
        style={styles?.button}
        onPress={_handleAuth}
        disabled={loading?.submitLoading}
      >
        <Text style={styles?.buttonText}>
          {isRegistering ? "Sign Up" : "Login"}{" "}
          {loading?.submitLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : null}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles?.switchText}>
          {isRegistering
            ? "Already have an account? Login"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    marginTop: 10,
    color: "#007bff",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
    marginRight: "auto",
    fontSize: 12,
  },
});
