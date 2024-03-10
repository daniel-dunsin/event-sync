import expressAsyncHandler from "express-async-handler";
import { getUserWalletInfo, getWalletLogs } from "../../services/wallet.service";
import { Request } from "express";
import { WalletTransactionDirection } from "../../schema/enums/payment.enum";

export const getUserWalletInfoControllers = expressAsyncHandler(async (req, res) => {
  const userId = req.userId as number;

  const data = await getUserWalletInfo(userId);

  res.status(200).json(data);
});

export const getWalletLogsController = expressAsyncHandler(
  async (req: Request<{}, {}, {}, { direction?: WalletTransactionDirection }>, res) => {
    const userId = req.userId as number;

    const data = await getWalletLogs({ userId, direction: req.query.direction });

    res.status(200).json(data);
  }
);
