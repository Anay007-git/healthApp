import { getGyms, getSupplements } from "@/lib/db";
import GymsSupplementsDashboard from "@/components/GymsSupplementsDashboard";

export const revalidate = 3600; // Cache page static generation, ISR revalidate every hour

export default async function GymsSupplementsPage() {
  const gyms = await getGyms();
  const supplements = await getSupplements();
  
  return (
    <GymsSupplementsDashboard initialGyms={gyms} initialSupplements={supplements} />
  );
}
