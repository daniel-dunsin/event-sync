import expressAsyncHandler from "express-async-handler";
import { getUserProfile, updateProfilePicture, updateUserProfile } from "../../services/user.service";
import { Request } from "express";
import { UpdateProfilePictureDTO, UpdateUserDTO } from "../../schema/dto/user.dto";

export const getUserProfileController = expressAsyncHandler(async (req, res) => {
  const userId = req.userId as number;

  const data = await getUserProfile(userId);

  res.status(200).json(data);
});

export const updateUserProfileController = expressAsyncHandler(async (req: Request<{}, {}, UpdateUserDTO>, res) => {
  const userId = req.userId as number;

  await updateUserProfile({ ...req.body, userId });

  res.status(200).json({ message: "updated profile successfully" });
});

export const updateProfilePictureController = expressAsyncHandler(async (req: Request<{}, {}, UpdateProfilePictureDTO>, res) => {
  const userId = req.userId as number;

  await updateProfilePicture({ ...req.body, userId });

  res.status(200).json({ message: "updated profile picture successfully" });
});
