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

const PAYMENTS = createPayments().sort((a, b) => b.createdAt - a.createdAt);

export const clientLoader = async ({ request }: ClientLoaderFunctionArgs) => {
  await sleep(500);

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

export default function Index() {
  return (
    <div className="flex grid-cols-[repeat(3,250px),auto] grid-rows-[100px,500px] flex-col gap-4 p-10 xl:grid">
      <div className="border">something1</div>
      <div className="border">something2</div>
      <div className="border">something3</div>
      <div className="col-end-5 row-span-full border">something4</div>
      <div className="col-span-3">
        <PaymentHistory />
      </div>
    </div>
  );
}
