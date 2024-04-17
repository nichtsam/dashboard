import { ChartOne } from "#app/components/chart1";
import { createData as createDataOne } from "#app/components/chart1/faker";
import { PaymentHistory } from "#app/components/payment-history";
import { createPayments } from "#app/components/payment-history/faker";
import { sleep } from "#app/utils/misc";
import type { MetaFunction } from "@remix-run/node";
import { ClientLoaderFunctionArgs } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

const DATA_ONE = createDataOne();
const PAYMENTS = createPayments().sort((a, b) => b.createdAt - a.createdAt);
const getPayments = (request: Request) => {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page")) || 1;
  if (isNaN(page)) {
    throw new Error("Invalid Page");
  }

  const start = (page - 1) * 10;
  const end = page * 10;

  return {
    payments: PAYMENTS.slice(start, end),
    nextPage: end < PAYMENTS.length ? page + 1 : null,
  };
};

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  await sleep(500);

  const { payments, nextPage } = getPayments(request);

  // wrapped together for convenience
  return {
    dataOne: DATA_ONE,

    payments,
    nextPage,
  };
};

export default function Index() {
  return (
    <div className="flex grid-cols-[repeat(3,250px),auto] grid-rows-[100px,500px] flex-col gap-4 p-10 xl:grid">
      <div>
        <ChartOne />
      </div>
      <div className="border">{"<ChartTwo />"}</div>
      <div className="border">{"<ChartThree />"}</div>
      <div className="col-end-5 row-span-full border">{"<ChartFour />"}</div>
      <div className="col-span-3">
        <PaymentHistory />
      </div>
    </div>
  );
}
