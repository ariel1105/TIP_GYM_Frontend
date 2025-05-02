import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { View, TextInput, Button, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useColors from "@/theme/useColors";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colors = useColors();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: colors.text,
    },
    input: {
      marginBottom: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.black,
      borderRadius: 8,
      backgroundColor: colors.cardBackground,
      color: colors.black,
    },
    registerLink: {
      marginTop: 20,
      textAlign: "center",
      color: colors.primary,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 10,
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontWeight: "bold",
      color: colors.onPrimary,
      alignSelf: "center"
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor={colors.black}
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor={colors.black}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={() => login({ username, password })}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Pressable  onPress={() => router.push("/register")}>
        <Text style={styles.registerLink}>
          ¿No tenés una cuenta? Registrate acá
        </Text>
      </Pressable>
      <Pressable  onPress={() => router.push("/home")}>
        <Text style={styles.registerLink}>
          Continuar sin una cuenta
        </Text>
      </Pressable>
    </View>
  );
}
