import { Router } from "express";
import { getUserWalletInfoControllers, getWalletLogsController } from "../../controllers/wallet/wallet.controller";

const walletRoutes = Router();

walletRoutes.get("/", getUserWalletInfoControllers);
walletRoutes.get("/logs", getWalletLogsController);

export default walletRoutes;
