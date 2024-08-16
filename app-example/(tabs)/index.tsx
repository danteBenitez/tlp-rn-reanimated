import { ThemedText } from "@/components/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const BACKGROUND_GRADIENT_COLORS = ["#8ec5fc", "#e0c3fc"];
/**
 *   background-color: #8EC5FC;
 *   background-image: linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%);
 */

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <LinearGradient
        colors={BACKGROUND_GRADIENT_COLORS}
        style={styles.container}
      >
        <ThemedText style={[styles.title]}>
          ¡Bienvenido a mi aplicación de tareas!
        </ThemedText>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    margin: 20,
    backgroundColor: "transparent",
  },
  container: {
    height: "100%",
  },
});
