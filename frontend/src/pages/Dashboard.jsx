import DashboardModule from "@/modules/DashboardModule";
import ErpContextLayout from '@/layout/ErpContextLayout';
export default function Dashboard() {
  
  return(
    <ErpContextLayout>
        <DashboardModule/>
    </ErpContextLayout>
  );
}
