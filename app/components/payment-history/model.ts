export enum PaymentStatus {
  SUCCESS = "Success",
  FAILED = "Failed",
}

export type Payment = {
  id: string;
  description: string;
  amount: number;
  status: PaymentStatus;
  createdAt: number;
};
