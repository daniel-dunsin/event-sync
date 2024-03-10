import { paymentInstance } from "../config/payment.config";
import secrets from "../constants/secrets.const";
import {
  AccountLookupDTO,
  AccountLookupResponse,
  InitiateTransactionDTO,
  InitiateTransactionResponse,
  WithdrawalRequest,
} from "../schema/dto/payment.dto";
import ServiceException from "../schema/exceptions/service.exception";
import crypto from "crypto";

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
  } catch (error: any) {
    throw new ServiceException(500, error);
  }
}

export async function lookupAccount(data: AccountLookupDTO): Promise<AccountLookupResponse> {
  const { account_number, bank_code } = data;

  try {
    const response = await paymentInstance.post<{ data: AccountLookupResponse }>("/payout/account/lookup", {
      bank_code,
      account_number,
    });

    return response?.data?.data;
  } catch (error: any) {
    console.log(error);
    throw new ServiceException(500, error);
  }
}

export async function initiateWithdrawal(data: WithdrawalRequest) {
  try {
    const { transaction_reference, amount, bank_code, account_name, account_number, remark } = data;

    const response = await paymentInstance.post(`/payout/transfer`, {
      transaction_reference,
      amount,
      bank_code,
      account_number,
      account_name,
      currency_id: "NGN",
      remark,
    });

    return response?.data?.data;
  } catch (error: any) {
    console.log(error);
    throw new ServiceException(500, error);
  }
}

export async function validateWebhookSignature(data: string, encryptedData: string) {
  const hash = crypto.createHmac("sha512", secrets.squad.sandboxKey).update(JSON.stringify(data)).digest("hex").toUpperCase();
  if (hash != encryptedData) {
    throw new ServiceException(401, "unable to verify squad signature");
  }
}
