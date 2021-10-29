import { ErpLayout } from "@/layout";
import ErpPanel from "@/components/ErpPanel/ErpPanel";
import QuoteForm from "./QuoteForm";

export default function InvoiceModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        CreateForm={QuoteForm}
        UpdateForm={QuoteForm}
      ></ErpPanel>
    </ErpLayout>
  );
}
