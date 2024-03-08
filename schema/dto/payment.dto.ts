import { WebhookEvents } from "../enums/payment.enum";

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

export interface WebhookResponse {
  Event: WebhookEvents;
  TransactionRef: string;
  Body: {
    amount: number;
    transaction_ref: string;
    gateway_ref: string;
    email: string;
    merchant_id: string;
    currency: string;
    transaction_type: string;
    created_at: Date;
    is_recurring: boolean;
  };
}
