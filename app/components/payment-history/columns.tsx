import { type ColumnDef } from "@tanstack/react-table";
import { PaymentStatus, type Payment } from "./model";
import { Badge } from "../ui/badge";
import dayjs from "dayjs";

const amountFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "createdAt",
    header: "Date Created",
    cell: ({ row }) => {
      const createdAt = row.original.createdAt;
      return dayjs(createdAt).format("DD/MM/YY hh:mmA");
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.amount;
      return amountFormatter.format(amount);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      const variant = (
        {
          [PaymentStatus.SUCCESS]: "outline",
          [PaymentStatus.FAILED]: "destructive",
        } as const
      )[status];

      return (
        <Badge className="flex w-20 justify-center" variant={variant}>
          {status}
        </Badge>
      );
    },
  },
];
