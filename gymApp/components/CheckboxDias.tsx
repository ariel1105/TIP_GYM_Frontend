import { CheckboxDiasProps } from "@/types/types";
import { View, Text, TouchableOpacity, StyleSheet} from "react-native";

const CheckboxDias: React.FC<CheckboxDiasProps> = ({ diasSemana, diasHabilitados, fijados, toggleDia }) => (
    <View style={styles.checkboxContainer}>
      {diasSemana.map((dia) => {
        const disponible = diasHabilitados.includes(dia);
        const seleccionado = fijados.includes(dia);
        return (
          <TouchableOpacity
            key={dia}
            onPress={() => disponible && toggleDia(dia)}
            style={[
              styles.checkboxButton,
              !disponible && styles.checkboxDisabled,
              seleccionado && disponible && styles.checkboxSelected,
            ]}
            activeOpacity={disponible ? 0.7 : 1}
          >
            <Text style={[
              styles.checkboxText,
              !disponible && styles.checkboxTextDisabled,
              seleccionado && disponible && styles.checkboxTextSelected
            ]}>
              {dia.charAt(0)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

export default CheckboxDias

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  checkboxButton: {
    padding: 10,
    backgroundColor: "black",
    borderRadius: 6,
  },
  checkboxSelected: {
    backgroundColor: "#FFC90E",
  },
  checkboxText: {
    color: "white", 
    fontWeight: "bold",
  },
  checkboxTextSelected: {
    color: "black",
  },
  checkboxDisabled: {
    backgroundColor: "#333",
    opacity: 0.3,
  },
  checkboxTextDisabled: {
    color: "#5E5E5E",
  },
});