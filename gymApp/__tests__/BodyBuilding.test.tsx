// __tests__/BodyBuilding.test.tsx
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import BodyBuilding from "../app/(tabs)/bodyBuilding";
import { AuthContext } from "../context/AuthContext";
import Api from "../services/Api";

// Mock del servicio
jest.mock("../services/Api");
jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  getExpoPushTokenAsync: jest.fn(),
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(),
  addNotificationResponseReceivedListener: jest.fn(),
  removeNotificationSubscription: jest.fn(),
}));

jest.mock('expo-device', () => ({
  isDevice: true,
}));

describe("BodyBuilding subscription", () => {
  it("permite suscribirse a musculación con días configurados", async () => {
    const fakeToken = "fake-token";
    jest.spyOn(Api, "subscribeToBodyBuilding").mockResolvedValue({} as any);

    const fakeContext = {
      token: fakeToken,
      member: {
        id: 1,
        name: "Test User",
        subscriptions: [],
        turns: [],
        vouchers: [],
        activitiesToNotify: [],
      },
    };

    const { getByText, queryByText } = render(
      <AuthContext.Provider value={fakeContext as any}>
        <BodyBuilding />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText("→")); // cambia de 3 a 4 días
    fireEvent.press(getByText("Confirmar suscripción"));

    await waitFor(() => {
      expect(Api.subscribeToBodyBuilding).toHaveBeenCalledWith(4, fakeToken);
    });

    await waitFor(() => {
      expect(getByText(/¡Suscripción exitosa!/i)).toBeTruthy();
      expect(getByText(/Te suscribiste a musculación 4 días\/semana/i)).toBeTruthy();
    });

    fireEvent.press(getByText("Cerrar"));

    await waitFor(() => {
      expect(queryByText(/¡Suscripción exitosa!/i)).toBeNull();
    });
  });

  it("muestra un error si ya existe una suscripción activa", async () => {
    const fakeToken = "fake-token";
    jest.spyOn(Api, "subscribeToBodyBuilding").mockRejectedValue({
      response: {
        data: {
          message: "Ya tenés una suscripción activa",
        },
      },
    });

    const fakeContext = {
      token: fakeToken,
      member: {
        id: 1,
        name: "Test User",
        subscriptions: [],
        turns: [],
        vouchers: [],
        activitiesToNotify: [],
      },
    };

    const { getByText, queryByText } = render(
      <AuthContext.Provider value={fakeContext as any}>
        <BodyBuilding />
      </AuthContext.Provider>
    );

    fireEvent.press(getByText("Confirmar suscripción"));

    await waitFor(() => {
      expect(Api.subscribeToBodyBuilding).toHaveBeenCalledWith(3, fakeToken);
    });

    await waitFor(() => {
      expect(getByText("Ya tenés una suscripción activa")).toBeTruthy();
    });

    fireEvent.press(getByText("Aceptar"));

    await waitFor(() => {
      expect(queryByText("Ya tenés una suscripción activa")).toBeNull();
    });
  });
});
