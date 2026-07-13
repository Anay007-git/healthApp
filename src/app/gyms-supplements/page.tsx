import { getGyms, getSupplements } from "@/lib/db";
import GymsSupplementsDashboard from "@/components/GymsSupplementsDashboard";

export const dynamic = 'force-dynamic'; // Fetch live database values on every page request

export default async function GymsSupplementsPage() {
  const gyms = await getGyms();
  const supplements = await getSupplements();
  
  return (
    <GymsSupplementsDashboard initialGyms={gyms} initialSupplements={supplements} />
  );
}
