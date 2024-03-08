import { paymentInstance } from "../config/payment.config";
import { InitiateTransactionDTO, InitiateTransactionResponse } from "../schema/dto/payment.dto";
import ServiceException from "../schema/exceptions/service.exception";

export async function initiateTransaction(data: InitiateTransactionDTO): Promise<InitiateTransactionResponse> {
  const { email, amount, transaction_ref, customer_name } = data;

  try {
    const response = await paymentInstance.post<{ data: InitiateTransactionResponse }>(`/transaction/initiate`, {
      email,
      amount,
      transaction_ref,
      customer_name,
      initiate_type: "inline",
      currency: "NGN",
    });

    return response?.data?.data;
  } catch (error) {
    throw new ServiceException(500, "Unable to initiate transaction");
  }
}
