import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {userName || "Invitado"}!</Text>
      <Text style={styles.question}>¿Qué querés entrenar hoy?</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/activities")}
        >
          <Image 
            source={require('../assets/images/actividades.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Actividades</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/machines")}
        >
          <Image 
            source={require('../assets/images/maquinas.png')}
            style={styles.buttonImage}
          />
          <Text style={styles.buttonText}>Máquinas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D1D1D",
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#B2A2D4",
    textAlign: 'center',
  },
  question: {
    fontSize: 20,
    marginBottom: 40,
    color: "#B2A2D4",
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 15, 
    width: '45%',
    marginBottom: 40, 
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: 'center',
  },
  buttonImage: {
    width: 200,  
    height: 250,
    resizeMode: "contain",
    borderRadius: 20, 
    marginBottom: 10,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.6)", 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 15, 
  },
});
