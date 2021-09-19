import { ErpLayout } from "@/layout";
import IndexErpPanel from "./IndexErpPanel";

export default function ErpPanel({ config }) {
  return (
    <ErpLayout>
      <IndexErpPanel config={config}></IndexErpPanel>
    </ErpLayout>
  );
}
