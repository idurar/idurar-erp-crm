import { ErpLayout } from "@/layout";
import ErpPanel from "@/components/ErpPanel/ErpPanel";
import InvoiceForm from "./InvoiceForm";

export default function InvoiceModule({ config }) {
  return (
    <ErpLayout>
      <ErpPanel
        config={config}
        CreateForm={InvoiceForm}
        UpdateForm={InvoiceForm}
      ></ErpPanel>
    </ErpLayout>
  );
}
