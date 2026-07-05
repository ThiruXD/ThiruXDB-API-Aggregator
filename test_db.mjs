import { MongoClient } from 'mongodb';
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://tamizhmasters_db_user:OsXJH9eTwHzg9BIp@cluster0.hyinwku.mongodb.net/?appName=Clus";
async function run() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('thiruXDB');
  const collections = await db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));
  
  const endpoints = await db.collection('thiruxdb_api_endpoints').find().toArray();
  console.log("Endpoints with variables:");
  endpoints.forEach(e => {
    if (e.path_variables && e.path_variables.length > 0) {
      console.log(e.name, e.base_url, JSON.stringify(e.path_variables));
    }
  });
  process.exit(0);
}
run();
