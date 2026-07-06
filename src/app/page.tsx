import { getJunkItems } from "@/lib/db";
import SearchDashboard from "@/components/SearchDashboard";

export const revalidate = 3600; // Cache page static generation, ISR revalidate every hour

export default async function Home() {
  const junkItems = await getJunkItems();
  
  return (
    <SearchDashboard initialJunkItems={junkItems} />
  );
}
