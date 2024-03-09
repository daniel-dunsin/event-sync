import { GenerateQrCode } from "../schema/dto/qrcode.dto";
import QrCode from "qrcode";
import ServiceException from "../schema/exceptions/service.exception";

export async function generateQrCode(data: GenerateQrCode): Promise<string> {
  try {
    const url = await QrCode.toDataURL(JSON.stringify(data), { errorCorrectionLevel: "L" });
    console.log(url);
    return url;
  } catch (error) {
    throw new ServiceException(500, "unable to generate qrcode");
  }
}
