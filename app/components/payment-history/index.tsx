import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Payment } from "./model";
import { DataTable } from "./table";

export function PaymentHistory({
  data,
  hasMore,
  isLoading,
  loadMore,
}: {
  data: Payment[];
  hasMore?: boolean;
  isLoading?: boolean;
  loadMore?: () => void;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          <h2 className="text-3xl">Payment History</h2>
        </AccordionTrigger>
        <AccordionContent>
          <DataTable
            data={data}
            hasMore={hasMore}
            isLoading={isLoading}
            loadMore={loadMore}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
