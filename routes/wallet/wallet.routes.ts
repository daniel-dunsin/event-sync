import { Router } from "express";
import {
  getUserWalletInfoControllers,
  getWalletLogsController,
  withdrawController,
} from "../../controllers/wallet/wallet.controller";
import { validate } from "../../middlewares/validator.middleware";
import { withdrawInput } from "../../schema/validators/wallet.validator";

const walletRoutes = Router();

walletRoutes.get("/", getUserWalletInfoControllers);
walletRoutes.get("/logs", getWalletLogsController);
walletRoutes.post("/withdraw", validate(withdrawInput), withdrawController);

export default walletRoutes;
