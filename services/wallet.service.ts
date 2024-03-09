import { v4 } from "uuid";
import { WalletTransactionModel } from "../models/wallet-transaction.model";
import { WalletModel } from "../models/wallet.model";
import { CreateWalletTransactionDTO } from "../schema/dto/wallet.dto";
import { WalletTransactionClerk, WalletTransactionStatus } from "../schema/enums/payment.enum";
import ServiceException from "../schema/exceptions/service.exception";

export async function createWalletTransaction(data: CreateWalletTransactionDTO) {
  await WalletTransactionModel.create({ ...data });

  if (data.status === WalletTransactionStatus.SUCCESSFUL) {
    if (data.clerkType === WalletTransactionClerk.CREDIT) {
      await WalletModel.increment({ balance: data.amount }, { where: { id: data.walletId } });
    } else {
      await WalletModel.decrement({ balance: data.amount }, { where: { id: data.walletId } });
    }
  }
}

export async function createWallet(userId: number) {
  const walletInDb = await WalletModel.findOne({ where: { userId } });

  if (walletInDb) return walletInDb;

  return await WalletModel.create({ userId });
}

export async function getUserWalletInfo(userId: number) {
  const wallet = await WalletModel.findOne({ where: { userId } });

  if (!wallet) throw new ServiceException(404, "user wallet does not exist");

  return wallet;
}
