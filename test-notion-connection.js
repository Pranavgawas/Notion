import { Client } from '@notionhq/client';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Notion API Connection...');
console.log('API Key (first 15 chars):', process.env.NOTION_API_KEY?.substring(0, 15) + '...');
console.log('Database ID:', process.env.NOTION_DATABASE_ID);

const notion = new Client({ 
  auth: process.env.NOTION_API_KEY 
});

try {
  console.log('\nAttempting to query database...');
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });
  console.log('✅ Success! Found', response.results.length, 'pages in database');
  console.log('\nFirst page:', response.results[0]?.properties);
} catch (error) {
  console.error('❌ Error:', error.message);
  console.error('Status:', error.status);
  console.error('Code:', error.code);
  if (error.status === 401) {
    console.error('\n⚠️  Authentication failed. Please check your API key.');
  } else if (error.status === 404) {
    console.error('\n⚠️  Database not found. Please check:');
    console.error('   1. The database ID is correct');
    console.error('   2. The integration has access to the database');
  }
}
