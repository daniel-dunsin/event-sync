import { v4 } from "uuid";
import { WalletTransactionModel } from "../models/wallet-transaction.model";
import { WalletModel } from "../models/wallet.model";
import { CreateWalletTransactionDTO, GetWalletLogsDTO, WithdrawDTO } from "../schema/dto/wallet.dto";
import { WalletTransactionDirection, WalletTransactionStatus } from "../schema/enums/payment.enum";
import ServiceException from "../schema/exceptions/service.exception";
import { initiateWithdrawal } from "../helpers/payment.helper";
import secrets from "../constants/secrets.const";

export async function createWalletTransaction(data: CreateWalletTransactionDTO) {
  const transaction = await WalletTransactionModel.create({ ...data });

  if (data.status === WalletTransactionStatus.SUCCESSFUL) {
    if (data.direction === WalletTransactionDirection.CREDIT) {
      await WalletModel.increment({ balance: data.amount }, { where: { id: data.walletId } });
    } else {
      await WalletModel.decrement({ balance: data.amount }, { where: { id: data.walletId } });
    }
  }

  return transaction;
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

export async function getWalletLogs(data: GetWalletLogsDTO) {
  const wallet = await WalletModel.findOne({ where: { userId: data.userId } });

  if (!wallet) throw new ServiceException(404, "wallet does not exist");

  let query = {};

  if (data.direction) {
    query = { direction: data.direction, walletId: wallet.id };
  } else {
    query = { walletId: wallet.id };
  }

  const logs = await WalletTransactionModel.findAll({ where: { ...query } });

  return logs;
}

export async function withdraw(data: WithdrawDTO) {
  const wallet = await WalletModel.findOne({ where: { userId: data.userId } });

  if (!wallet) throw new ServiceException(404, "Wallet does not exist");
  if (data.amount > wallet.balance) throw new ServiceException(400, "insufficient balance");

  const reason = `Wallet withdrawal`;

  const transaction_reference = `${secrets.squad.merchantId}${v4()}`;

  await initiateWithdrawal({ ...data, remark: reason, transaction_reference });

  const log = await createWalletTransaction({
    reason,
    transaction_reference,
    direction: WalletTransactionDirection.DEBIT,
    amount: data.amount,
    walletId: wallet.id,
    status: WalletTransactionStatus.SUCCESSFUL,
  });

  return log;
}
