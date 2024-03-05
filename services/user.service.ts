import { uploadResource } from "../helpers/upload.helper";
import { UserModel } from "../models/user.model";
import { UpdateProfilePictureDTO, UpdateUserDTO } from "../schema/dto/user.dto";
import redisCache from "./cache.service";

export async function getUserProfile(userId: number) {
  let user = await redisCache.get<UserModel>(`user:${userId}`);
  if (!user) {
    user = await UserModel.findByPk(userId);
    await redisCache.set(`user:${userId}`, user);
  }

  return user;
}

export async function updateUserProfile({ userId, ...data }: UpdateUserDTO) {
  await UserModel.update({ ...data }, { where: { id: userId } });
  await redisCache.delete(`user:${userId}`);
}

export async function updateProfilePicture(data: UpdateProfilePictureDTO) {
  const { url, public_id } = await uploadResource(data.profilePicture);

  await UserModel.update(
    {
      profilePicture: url,
      profilePictureId: public_id,
    },
    { where: { id: data.userId } }
  );

  await redisCache.delete(`user:${data.userId}`);
}
