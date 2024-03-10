import { WalletTransactionDirection, WalletTransactionStatus } from "../enums/payment.enum";

export interface CreateWalletTransactionDTO {
  walletId?: number;
  direction: WalletTransactionDirection;
  amount: number;
  status: WalletTransactionStatus;
  transaction_reference?: string;
  reason?: string;
}

export interface GetWalletLogsDTO {
  direction?: WalletTransactionDirection;
  userId: number;
}

export interface WithdrawDTO {
  userId: number;
  amount: number;
  account_number: string;
  bank_code: string;
  account_name: string;
}
