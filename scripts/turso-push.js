const { createClient } = require('@libsql/client');

const url = 'libsql://pyhood-masud-ahmad-1.aws-ap-south-1.turso.io?authToken=eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3ODMxMDIzOTcsImlkIjoiMDE5ZjI5MmUtOTkwMS03ODNjLThjMzAtMTYzNGFkNmM3YzdiIiwia2lkIjoiRDRyelJzMGxrVGJnTElpQ2p3VTJ0aVZHREJnWGZjNERId3prcTBxZmcxUSIsInJpZCI6IjE5NTNhNTNmLTljODQtNDM0My05NmU0LTdmNTUzMzIyNzMyYyJ9.9R08sRnJLPtFRswtEBthUQ83qGucznECpFkNo0dZDvxvhxqyEeuvQ1WY66pcj23CLKcmoFU242UuxAhrfuNZDw';

const fs = require('fs');
const sql = fs.readFileSync('/tmp/pyhood-schema.sql', 'utf-8');

async function main() {
  const client = createClient({ url });
  
  // Split by semicolons and execute each statement
  const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  
  for (let i = 0; i < statements.length; i++) {
    try {
      await client.execute(statements[i]);
      console.log(`[${i+1}/${statements.length}] OK`);
    } catch (err) {
      console.error(`[${i+1}/${statements.length}] ERROR: ${err.message.substring(0, 120)}`);
    }
  }
  
  console.log('\nDone!');
}

main().catch(console.error);