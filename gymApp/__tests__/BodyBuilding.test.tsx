// __tests__/BodyBuilding.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import BodyBuilding from "../app/(tabs)/bodyBuilding";
import { AuthContext } from "../context/AuthContext";
import Api from "../services/Api";

// Mock del servicio
jest.mock("../services/Api");

describe("BodyBuilding subscription", () => {
  it("permite suscribirse a musculación con días configurados", async () => {
    const mockSubscribe = jest.fn().mockResolvedValue({});
    (Api.subscribeToBodyBuilding as jest.Mock) = mockSubscribe;

    const fakeToken = "fake-token";

    const fakeContext = {
      token: fakeToken,
    };

    const { getByText, queryByText } = render(
      <AuthContext.Provider value={fakeContext as any}>
        <BodyBuilding />
      </AuthContext.Provider>
    );

    // Verificar que aparece el texto inicial
    expect(getByText("Musculación")).toBeTruthy();
    expect(getByText("3 días/sem")).toBeTruthy();

    // Cambiar a 4 días
    fireEvent.press(getByText("→"));
    expect(getByText("4 días/sem")).toBeTruthy();

    // Confirmar suscripción
    fireEvent.press(getByText("Confirmar suscripción"));

    // Esperar que el mock sea llamado con los parámetros esperados
    await waitFor(() => {
      expect(mockSubscribe).toHaveBeenCalledWith(4, fakeToken);
    });

    // Esperar que aparezca el modal de éxito
    await waitFor(() => {
      expect(getByText(/¡Suscripción exitosa!/i)).toBeTruthy();
      expect(getByText(/Te suscribiste a musculación 4 días\/semana/i)).toBeTruthy();
    });

    // Cerrar el modal
    fireEvent.press(getByText("Cerrar"));
    await waitFor(() => {
      expect(queryByText(/¡Suscripción exitosa!/i)).toBeNull();
    });
  });
});

it("muestra un error si ya existe una suscripción activa", async () => {
  const mockSubscribe = jest.fn().mockRejectedValue({
    response: {
      data: {
        message: "Ya tenés una suscripción activa",
      },
    },
  });

  (Api.subscribeToBodyBuilding as jest.Mock) = mockSubscribe;

  const fakeToken = "fake-token";

  const fakeContext = {
    token: fakeToken,
  };

  const { getByText } = render(
    <AuthContext.Provider value={fakeContext as any}>
      <BodyBuilding />
    </AuthContext.Provider>
  );

  // Confirmar suscripción
  fireEvent.press(getByText("Confirmar suscripción"));

  // Verificar que se llama con los datos correctos
  await waitFor(() => {
    expect(mockSubscribe).toHaveBeenCalledWith(3, fakeToken);
  });

  // Verificar que aparece el mensaje de error específico
  await waitFor(() => {
    expect(getByText("Ya tenés una suscripción activa")).toBeTruthy();
  });

  // Cerrar el modal
  fireEvent.press(getByText("Aceptar"));

  // Esperar que el modal se cierre
  await waitFor(() => {
    expect(getByText("Confirmar suscripción")).toBeTruthy(); // se vuelve a la pantalla normal
  });
});

