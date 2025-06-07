import * as Linking from "expo-linking";
import { useEffect } from "react";
import { Alert } from "react-native";
import Api from "@/services/Api";
import { useAuth } from "@/context/AuthContext";

export const PaymentRedirectHandler = () => {
  const { vouchersArray, token, member, setMember, setAcquirementSuccessModalVisible } = useAuth();

  useEffect(() => {
    const handleUrl = async ({ url }: { url: string }) => {
      if (url.includes("payment-success")) {
        try {
          await Api.acquire(vouchersArray, token!!);
          const updatedVouchers = [...(member!!.vouchers || []), ...vouchersArray];
          setMember({ ...member, vouchers: updatedVouchers });
          setAcquirementSuccessModalVisible(true);
        } catch (error: any) {
          Alert.alert("Error al adquirir vouchers", error.message || "Ocurrió un error inesperado.");
        }
      } else if (url.includes("payment-failure")) {
        Alert.alert("Pago fallido", "El pago no fue completado.");
      }
    };

    const subscription = Linking.addEventListener("url", handleUrl);

    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) handleUrl({ url: initialUrl });
    })();

    return () => subscription.remove();
  }, [vouchersArray, token, member]);

  return null;
};
