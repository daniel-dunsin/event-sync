import { array, date, number, object, string } from "yup";
import DEFAULT_MATCHERS from "../../constants/regex.const";

export const createCategoryInput = object({
  body: object({
    name: string().required(),
    description: string().required(),
  }),
});

export const updateCategoryInput = object({
  params: object({
    id: string().required(),
  }),
  body: object({
    name: string().notRequired(),
    description: string().notRequired(),
  }),
});

export const createEventInput = object({
  body: object({
    name: string().required(),
    description: string().required().min(40, "description must not be less than 40 characters"),
    startDate: date().required(),
    startTime: date().required(),
    endDate: date().required(),
    endTime: date().required(),
    addressLine1: string().required(),
    addressLine2: string().notRequired(),
    city: string().required(),
    state: string().required(),
    country: string().required(),
    ticketPurchaseDeadline: date().required(),
    categories: array(number().strict()).min(1, "select at least one category").required(),
    gallery: array(
      object({
        name: string().required(),
        type: string().required(),
        url: string().required().matches(DEFAULT_MATCHERS.base64, "Enter valid base64 url"),
      })
    )
      .min(1, "select at least one image")
      .required(),
  }),
});

export const getEventsInput = object({
  query: object({
    search: string().notRequired(),
    page: number().notRequired(),
    limit: number().notRequired(),
  }),
});

export const updateEventInput = object({
  body: object({
    name: string().notRequired(),
    description: string().notRequired().min(40, "description must not be less than 40 characters"),
    startDate: date().notRequired(),
    startTime: date().notRequired(),
    endDate: date().notRequired(),
    endTime: date().notRequired(),
    addressLine1: string().notRequired(),
    addressLine2: string().notRequired(),
    city: string().notRequired(),
    state: string().notRequired(),
    country: string().notRequired(),
    ticketPurchaseDeadline: date().notRequired(),
  }),
});
