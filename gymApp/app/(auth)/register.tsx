import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import useColors from "@/theme/useColors";
import { Routes } from "../constants/routes";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const colors = useColors();
  const [errors, setErrors] = useState<{ name?: string; username?: string; password?: string; general?: string }>({});

  const handleRegister = async () => {
    const newErrors: typeof errors = {};
  
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!username) newErrors.username = "El nombre de usuario es obligatorio.";
    if (!username) {
      newErrors.username = "El nombre de usuario es obligatorio.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "El nombre de usuario solo puede contener letras, números y guiones bajos.";
    }  
    if (!password) {
      newErrors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await register({ name, username, password });
    } catch (err: any) {
      const message = err.message;
      if (message.includes(`el usuario ${username} ya esta registrado`)) {
        setErrors({ username: message });
      } else {
        setErrors({ general: message });
      }
    }
  };

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
    loginLink: {
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
      <Text style={styles.title}>Registro</Text>
      <View>
        <TextInput
          placeholder="Nombre"
          placeholderTextColor={colors.black}
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        {errors.name && <Text style={{ color: "red", marginBottom: 10 }}>{errors.name}</Text>}
      </View>

      <View>
        <TextInput
          placeholder="Username"
          placeholderTextColor={colors.black}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        {errors.username && <Text style={{ color: "red", marginBottom: 10 }}>{errors.username}</Text>}
      </View>

      <View>
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor={colors.black}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        {errors.password && <Text style={{ color: "red", marginBottom: 10 }}>{errors.password}</Text>}
      </View>

      {errors.general && <Text style={{ color: "red", marginBottom: 10 }}>{errors.general}</Text>}


      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <Pressable onPress={() => router.push(Routes.Login)}>
        <Text style={styles.loginLink}>
          ¿Ya tenés una cuenta? Iniciá sesión
        </Text>
      </Pressable>
    </View>
  );
}
