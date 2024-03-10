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
