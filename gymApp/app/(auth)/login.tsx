import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import useColors from "@/theme/useColors";
import { Routes } from "../constants/routes";

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colors = useColors();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      await login({ username, password });
    } catch (err: any) {
      setError(err.message);
    }
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      padding: 20,
      backgroundColor: colors.background,
    },
    logo: {
      width: 250,
      height: 250,
      resizeMode: "contain",
      alignSelf: "center",
      marginBottom: 20,
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
      color: colors.text,
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
       <Image
        source={require("../../assets/images/LogoSyncSpaceDark.jpg")}
        style={styles.logo}
      />
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
      {error !== "" && <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Pressable  onPress={() => router.push(Routes.Register)}>
        <Text style={styles.registerLink}>
          ¿No tenés una cuenta? Registrate acá
        </Text>
      </Pressable>
      <Pressable  onPress={() => router.push(Routes.Home)}>
        <Text style={styles.registerLink}>
          Continuar sin una cuenta
        </Text>
      </Pressable>
    </View>
  );
}
