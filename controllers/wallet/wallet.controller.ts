import expressAsyncHandler from "express-async-handler";
import { getUserWalletInfo } from "../../services/wallet.service";

export const getUserWalletInfoControllers = expressAsyncHandler(async (req, res) => {
  const userId = req.userId as number;

  const data = await getUserWalletInfo(userId);

  res.status(200).json(data);
});
