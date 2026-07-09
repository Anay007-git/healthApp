import { getSupplements, supabase } from '@/lib/db';
import AdminLabReportsClient from './AdminLabReportsClient';

export const dynamic = 'force-dynamic';

export default async function AdminLabReportsPage(props: {
  searchParams: Promise<{ token?: string }>;
}) {
  const searchParams = await props.searchParams;
  const token = searchParams.token || '';
  const secretToken = process.env.ADMIN_SECRET || 'NutriFitSwapAdminSecret';

  const isAuthorized = token === secretToken;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background-app text-text-app flex items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-border-app bg-card-app p-6 shadow-xl">
          <h2 className="text-sm font-black uppercase tracking-wider text-text-app text-center mb-4">
            Admin Authentication
          </h2>
          <form method="GET" action="/admin/lab-reports" className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-text-muted block mb-1">
                Admin Secret Key
              </label>
              <input
                type="password"
                name="token"
                placeholder="Enter secret key..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border-app bg-card-app/40 text-text-app font-medium text-xs focus:outline-none focus:ring-1 focus:ring-brand-primary placeholder:text-text-muted/50"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-brand-primary text-brand-primary-fg hover:opacity-90 font-bold text-xs shadow-md transition-all cursor-pointer text-center active:scale-[0.98]"
            >
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Fetch data on server-side
  const supplements = await getSupplements();
  
  let mappings: any[] = [];
  let reports: any[] = [];

  if (supabase) {
    try {
      const { data: maps } = await supabase.from('labdoor_mappings').select('*');
      const { data: reps } = await supabase.from('lab_reports').select('*');
      if (maps) mappings = maps;
      if (reps) reports = reps;
    } catch (err) {
      console.error('Failed to load server data:', err);
    }
  }

  return (
    <AdminLabReportsClient
      supplements={supplements}
      initialMappings={mappings}
      initialReports={reports}
      adminToken={token}
    />
  );
}
