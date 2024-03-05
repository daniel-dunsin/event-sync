import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import {
  getUserProfileController,
  updateProfilePictureController,
  updateUserProfileController,
} from "../../controllers/user/user.controller";
import { validate } from "../../middlewares/validator.middleware";
import { updateProfilePictureInput, updateUserInput } from "../../schema/validators/user.validator";

const userRoutes = Router();

userRoutes.get("/", authenticate, getUserProfileController);
userRoutes.put("/", authenticate, validate(updateUserInput), updateUserProfileController);
userRoutes.put("/profile-picture", authenticate, validate(updateProfilePictureInput), updateProfilePictureController);

export default userRoutes;
