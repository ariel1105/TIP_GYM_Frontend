import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";

export default function Register() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={{ padding: 20 }}>
      <Text>Register</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Register" onPress={() => register({ username, password })} />
    </View>
  );
}
