import expressAsyncHandler from "express-async-handler";
import { getUserWalletInfo, getWalletLogs, withdraw } from "../../services/wallet.service";
import { Request } from "express";
import { WalletTransactionDirection } from "../../schema/enums/payment.enum";
import { WithdrawDTO } from "../../schema/dto/wallet.dto";

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

export const withdrawController = expressAsyncHandler(async (req: Request<{}, {}, WithdrawDTO>, res) => {
  const userId = req.userId as number;

  const data = await withdraw({ ...req.body, userId });

  res.status(200).json(data);
});
