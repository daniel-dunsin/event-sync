import { WalletTransactionClerk, WalletTransactionStatus } from "../enums/payment.enum";

export interface CreateWalletTransactionDTO {
  walletId?: number;
  clerkType: WalletTransactionClerk;
  amount: number;
  status: WalletTransactionStatus;
  transaction_reference?: string;
}
