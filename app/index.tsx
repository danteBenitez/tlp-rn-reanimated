import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { ScaledSheet } from "react-native-size-matters";

const TRANSITION_COLORS = {
  INITIAL: "#8ec5fc",
  FINAL: "#e0c3fc",
};

export default function HomeScreen() {
  /**
   * Necesitamos que el título se deslice hacia abajo.
   * Pdemos hacer esto cambiando el atributo `marginTop`
   * de su contenedor.
   * El valor inicial es negativo de manera que el título
   * comience fuera de pantalla.
   */
  const titleTop = useSharedValue(-1200);

  /**
   * Creamos un objeto de estilos animados basados en el valor de `titleTop`
   */
  const titleStyles = useAnimatedStyle(() => {
    return {
      marginTop: titleTop.value,
    };
  });

  useEffect(() => {
    /**
     * Cuando se monta el componente, el margen transiciona a 0 y el título se muestra
     * en pantalla
     */
    titleTop.value = withTiming(0, {
      duration: 2500,
    });
  });

  /**
   * Para la animación del fondo y del desvanecimiento del título,
   * mediremos el progreso de la misma con un valor.
   */
  const transitionProgress = useSharedValue(0);

  /** Un pequeño estado para cambiar el texto del botón al aplicar la animación */
  const [transitionState, setTransitionState] = useState<"started" | "ended">("started");

  const startTransition = () => {
    transitionProgress.value = withTiming(1, {
      duration: 1000,
    });
    setTransitionState("ended");
  };

  const reverseTransition = () => {
    transitionProgress.value = withTiming(0, {
      duration: 1000,
    });
    setTransitionState("started");
  };

  const backgroundWithTransition = useAnimatedStyle(() => {
    /**
     * `interpolateColor` nos permite animar entre dos colores dados,
     * usando un `shared value` como medidor de progreso.
     * Cuando `transitionProgress` cambie, `interpolateColor`
     * retornará un color levemente diferente entre los dos
     * que le pasamos. Con 0 representando el color inicial y
     * 1 el color final.
     */
    return {
      backgroundColor: interpolateColor(
        transitionProgress.value,
        [0, 1],
        [TRANSITION_COLORS.INITIAL, TRANSITION_COLORS.FINAL]
      ),
    };
  });

  const titleTransition = useAnimatedStyle(() => {
    /**
     * Esta vez usamos `interpolate` para permitirnos
     * mapear un rango de progreso a la opacidad.
     * `transitionProgress` es 0 al comenzar y luego pasa a ser 1.
     * La opacidad debe ir al revés: Debe comenzar en 1 y terminar en 0,
     * puesto que queremos que el título se desvanezca.
     *
     * Para ello, mapeamos el rango [0, 1] a [1, 0].
     */
    return {
      opacity: interpolate(transitionProgress.value, [0, 1], [1, 0]),
    };
  });

  return (
    <Animated.View
      style={[
        styles.safeView,
        {
          backgroundColor: TRANSITION_COLORS.INITIAL,
        },
        backgroundWithTransition,
      ]}
    >
      <Animated.View style={[titleStyles]}>
        <Animated.View style={[styles.titleContainer, titleTransition]}>
          <ThemedText style={[styles.title]}>
            ¡Bienvenido a mi aplicación!
          </ThemedText>
        </Animated.View>
      </Animated.View>
      <ThemedView style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (transitionState == "ended") {
              return reverseTransition();
            }
            startTransition();
          }}
        >
          <ThemedText style={[styles.buttonText]}>
            {transitionState == "started" ? "Iniciar" : "Revertir"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </Animated.View>
  );
}

const styles = ScaledSheet.create({
  safeView: {
    paddingTop: "25@s",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8ec5fc",
  },
  container: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "16@s",
    fontWeight: "bold",
    color: "purple",
  },
  titleContainer: {
    maxHeight: "80%",
    backgroundColor: "white",
    padding: "25@s",
    margin: "10@s",
    borderRadius: "10@s",
    shadowColor: "purple",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    position: "absolute",
    bottom: "20@s",
  },
  button: {
    borderRadius: "5@s",
    padding: "14@s",
    backgroundColor: "#7476ee",
    shadowOpacity: 1,
    shadowColor: "#7476ee"
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: "18@s",
  },
});
