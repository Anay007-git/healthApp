const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: mappings, error } = await supabase.from('labdoor_mappings').select('supplement_id, labdoor_slug');
  if (error) {
    console.error(error);
    return;
  }

  console.log(`Checking ${mappings.length} mappings...`);
  const results = [];

  for (const m of mappings) {
    const url = `https://labdoor.com/review/${m.labdoor_slug}`;
    try {
      const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla' } });
      console.log(`Slug: ${m.labdoor_slug} -> Status: ${res.status}`);
      results.push({ slug: m.labdoor_slug, status: res.status });
    } catch (e) {
      console.log(`Slug: ${m.labdoor_slug} -> Error: ${e.message}`);
      results.push({ slug: m.labdoor_slug, status: 'ERROR' });
    }
  }

  console.log('--- Summary of 404 Slugs ---');
  console.log(results.filter(r => r.status === 404).map(r => r.slug));
}

run();
