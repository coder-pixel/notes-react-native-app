import { View, ActivityIndicator } from "react-native";

const FullScreenLoader = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    }}
  >
    <ActivityIndicator size="large" color="#007bff" />
  </View>
);

export default FullScreenLoader;
