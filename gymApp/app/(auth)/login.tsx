import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <Text>Login</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={() => login(username, password)} />
    </View>
  );
}
