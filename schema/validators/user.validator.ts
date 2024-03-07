import { object, string } from "yup";
import DEFAULT_MATCHERS from "../../constants/regex.const";

export const updateUserInput = object({
  body: object({
    firstName: string().notRequired(),
    lastName: string().notRequired(),
  }),
});

export const updateProfilePictureInput = object({
  body: object({
    profilePicture: string().required().matches(DEFAULT_MATCHERS.base64, "provide a valid base64 image"),
  }),
});
