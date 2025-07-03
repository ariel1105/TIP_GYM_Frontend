import { Voucher } from "../../types/types"
import { ACCESS_TOKEN } from "../../config.json"

export const handleIntegrationMP = async (vouchersSelected: Voucher[]) => {
    const description = vouchersSelected
    .map((voucher) => `${voucher.amount} vouchers ${voucher.activityName}`)
    .join(", ");

  const totalAmount = vouchersSelected.reduce(
    (sum, voucher) => sum + voucher.amount * voucher.price!!,
    0
  );
  console.log("Total a pagar:", totalAmount);

  const items = vouchersSelected.map((voucher) => ({
    title: `Voucher: ${voucher.activityName}`,
    description: `${voucher.amount} clase(s) de ${voucher.activityName}`,
    quantity: voucher.amount,
    currency_id: "ARS",
    unit_price: voucher.price,
    }));

    const preferencia = {
      items,
      back_urls: {
        success: "myapp://payment-success",
        failure: "myapp://payment-failure",
        pending: "myapp://payment-pending"
      },
      auto_return: "approved"
    };


  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(preferencia)
    });

    const data = await response.json();
    console.log("data", data)
    console.log("data init point", data.init_point)
    return data.init_point;

  } catch (error) {
    console.error("Error al crear la preferencia de Mercado Pago:", error);
    throw new Error("No se pudo generar la preferencia de pago.");
  }
};
