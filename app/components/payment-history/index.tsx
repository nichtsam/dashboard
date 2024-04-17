import { clientLoader } from "#app/routes/_index";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { DataTable } from "./table";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";

export function PaymentHistory() {
  const data = useLoaderData<typeof clientLoader>();
  const fetcher = useFetcher<typeof clientLoader>();

  const [payments, setPayments] = useState(data.payments);
  const nextPage = fetcher.data ? fetcher.data.nextPage : data.nextPage;
  const hasMore = !!nextPage;
  const isLoading = fetcher.state != "idle";
  const loadMore = () => {
    fetcher.submit({ page: nextPage });
  };

  useEffect(() => {
    if (fetcher.data) {
      const morePayments = fetcher.data.payments;
      setPayments((existingPayments) => [...existingPayments, ...morePayments]);
    }
  }, [fetcher.data]);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <h2 className="text-3xl">Payment History</h2>
        </AccordionTrigger>
        <AccordionContent>
          <DataTable
            data={payments}
            hasMore={hasMore}
            isLoading={isLoading}
            loadMore={loadMore}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
