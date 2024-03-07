export interface EventGalleryDTO {
  name: string;
  type: string;
  url: string;
}

export interface CreateEventDTO {
  name: string;
  description: string;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  ticketPurchaseDeadline: Date;
  userId: number;
  categories: number[];
  gallery: EventGalleryDTO[];
}

export interface CreateCategoryDTO {
  name: string;
  description: string;
}

export interface UpdateCategoryDTO extends CreateCategoryDTO {
  id: number;
}
