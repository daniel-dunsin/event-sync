export interface PurchaseTicketDTO {
  ticketId: number;
  userId: number;
  ticketsCount: number;
}

export interface InitiateTransactionDTO {
  email: string;
  amount: number;
  transaction_ref: string;
  customer_name: string;
}

export interface InitiateTransactionResponse {
  currency: string;
  is_recurring: boolean;
  callback_url: string;
  transaction_ref: string;
  transaction_amount: number;
  checkout_url: string;
}
