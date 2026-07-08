const { createClient } = require('@libsql/client');

const DB_URL = 'libsql://pyhood-masud-ahmad-1.aws-ap-south-1.turso.io';
const AUTH_TOKEN = process.env.TURSO_TOKEN || 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODMxMDIzOTcsImlkIjoiMDE5ZjI5MmUtOTkwMS03ODNjLThjMzAtMTYzNGFkNmM3YzdiIiwia2lkIjoiRDRyelJzMGxrVGJnTElpQ2p3VTJ0aVZHREJnWGZjNERId3prcTBxZmcxUSIsInJpZCI6IjE5NTNhNTNmLTljODQtNDM0My05NmU0LTdmNTUzMzIyNzMyYyJ9.9R08sRnJLPtFRswtEBthUQ83qGucznECpFkNo0dZDvxvhxqyEeuvQ1WY66pcj23CLKcmoFU242UuxAhrfuNZDw';

const client = createClient({ url: DB_URL, authToken: AUTH_TOKEN });

async function run() {
  // Delete the wand registration decree
  await client.execute({
    sql: `DELETE FROM Decree WHERE id = 'decree-1'`,
    args: []
  });
  console.log('✅ Deleted decree-1 (জাদুদণ্ড নিবন্ধন আইন)');

  // Delete the ticker about wand registration law
  await client.execute({
    sql: `DELETE FROM Ticker WHERE message LIKE '%জাদুদণ্ড নিয়ন্ত্রণ আইন%'`,
    args: []
  });
  console.log('✅ Deleted wand registration ticker');

  // Verify remaining decrees
  const result = await client.execute(`SELECT id, title FROM Decree WHERE issueId = 'issue-32847'`);
  console.log('Remaining decrees:', result.rows);

  // Verify remaining tickers
  const tickers = await client.execute(`SELECT id, message FROM Ticker WHERE issueId = 'issue-32847' ORDER BY sortOrder`);
  console.log('Remaining tickers:', tickers.rows.map(r => r.message));
}

run().catch(e => { console.error('❌ Error:', e.message); process.exit(1); });