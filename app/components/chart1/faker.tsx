import { faker } from "@faker-js/faker";
import { Datum } from "./model";
import dayjs from "dayjs";

export { createData, createDatum };

const createData = () => {
  return new Array(14).fill(undefined).map((_, index) =>
    createDatum(
      dayjs()
        .subtract(13 - index, "days")
        .valueOf(),
    ),
  );
};

const createDatum = (timestamp: number): Datum => {
  return {
    transactions: faker.number.int({ max: 2_000_000 }),
    price: faker.number.int({ max: 10_000 }),
    timestamp,
  };
};
