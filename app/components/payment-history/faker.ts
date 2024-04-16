import { faker } from "@faker-js/faker";
import { Payment, PaymentStatus } from "./model";

export { createPayments, createPayment };

function createPayments(): Payment[] {
  const payments = new Array(faker.number.int({ min: 30, max: 100 }))
    .fill(undefined)
    .map(() => createPayment());

  return payments;
}

function createPayment(): Payment {
  const SET = faker.helpers.arrayElement(DESCRIPTIONS_SETS);

  return {
    id: faker.string.uuid(),
    description: SET.description,
    amount: faker.number.int(SET.amountRange),
    status: faker.helpers.enumValue(PaymentStatus),
    createdAt: faker.date
      .between({
        from: "2023-03-01T00:00:00.000Z",
        to: "2023-06-30T23:59:59.999Z",
      })
      .getTime(),
  };
}

const DESCRIPTIONS_SETS = [
  {
    description: "Buy a car",
    amountRange: { min: 2000, max: 15000 },
  },
  {
    description: "Buy a cow",
    amountRange: { min: 150, max: 800 },
  },
  {
    description: "Buy drinks",
    amountRange: { min: 5, max: 100 },
  },
  {
    description: "Buy a bicycle",
    amountRange: { min: 100, max: 3000 },
  },
  {
    description: "Pay for dinner",
    amountRange: { min: 20, max: 200 },
  },
  {
    description: "Buy a table",
    amountRange: { min: 10, max: 100 },
  },
];
