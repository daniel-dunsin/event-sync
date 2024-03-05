import { v2, UploadApiOptions } from "cloudinary";
import secrets from "../constants/secrets.const";
import ServiceException from "../schema/exceptions/service.exception";

v2.config({
  api_key: secrets.cloudinary.apiKey,
  api_secret: secrets.cloudinary.apiSecret,
  cloud_name: secrets.cloudinary.cloudName,
});

interface UploadResponse {
  public_id: string;
  url: string;
}

export async function uploadResource(file: string, options?: UploadApiOptions): Promise<UploadResponse> {
  try {
    const response = await v2.uploader.upload(file, { folder: "event-sync" });

    return { public_id: response?.public_id, url: response?.secure_url };
  } catch (error) {
    throw new ServiceException(400, "unable to upload resource");
  }
}

export async function deleteResource(publicId: string) {
  try {
    await v2.uploader.destroy(publicId);
  } catch (error) {
    throw new ServiceException(400, "unable to delete resource");
  }
}
