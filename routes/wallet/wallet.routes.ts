import { Router } from "express";
import { getUserWalletInfoControllers } from "../../controllers/wallet/wallet.controller";

const walletRoutes = Router();

walletRoutes.get("/", getUserWalletInfoControllers);

export default walletRoutes;
