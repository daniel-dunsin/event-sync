import { GenerateQrCode } from "../schema/dto/qrcode.dto";
import QrCode from "qrcode";
import ServiceException from "../schema/exceptions/service.exception";
import { uploadResource } from "./upload.helper";

export async function generateQrCode(data: GenerateQrCode): Promise<string> {
  try {
    const qrCodeUrl = await QrCode.toDataURL(JSON.stringify(data), { errorCorrectionLevel: "L" });

    const { url } = await uploadResource(qrCodeUrl, { folder: "qr_codes" });

    return url;
  } catch (error) {
    throw new ServiceException(500, "unable to generate qrcode");
  }
}
