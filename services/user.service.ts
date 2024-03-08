import { deleteResource, uploadResource } from "../helpers/upload.helper";
import { TicketModel } from "../models/ticket.model";
import { UserModel } from "../models/user.model";
import { PurchaseTicketDTO } from "../schema/dto/payment.dto";
import { UpdateProfilePictureDTO, UpdateUserDTO } from "../schema/dto/user.dto";
import ServiceException from "../schema/exceptions/service.exception";
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

  const user = await UserModel.findByPk(data.userId);

  if (!user) throw new ServiceException(404, "User does not exist");

  const profilePictureId = user.profilePictureId;

  if (profilePictureId) await deleteResource(profilePictureId);

  user.profilePicture = url;
  user.profilePictureId = public_id;

  await user.save();

  await redisCache.delete(`user:${data.userId}`);
}
