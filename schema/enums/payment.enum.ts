export enum WalletTransactionDirection {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum WalletTransactionStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  FAILED = "failed",
}

export enum PaymentStatus {
  PENDING = "pending",
  SUCCESSFUL = "successful",
  FAILED = "failed",
}

export enum WebhookEvents {
  CHARGE_SUCCESSFUL = "charge_successful",
  CHARGE_FAILED = "charge_failed",
}
