import { InvoiceLayout } from "@/layout";
import IndexInvoicePanel from "./IndexInvoicePanel";

export default function InvoicePanel({ config }) {
  return (
    <InvoiceLayout>
      <IndexInvoicePanel config={config}></IndexInvoicePanel>
    </InvoiceLayout>
  );
}
