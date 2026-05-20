const { MongoClient } = require('mongodb');

// Test different connection strings
const connections = [
  {
    name: "Option 1: With TLS fix",
    uri: "mongodb+srv://dv45:ZghJABeftpXgJQUa@cluster0.tvrnsgq.mongodb.net/devpath?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true"
  },
  {
    name: "Option 2: Standard connection",
    uri: "mongodb://dv45:ZghJABeftpXgJQUa@ac-kmyhypw-shard-00-00.tvrnsgq.mongodb.net:27017,ac-kmyhypw-shard-00-01.tvrnsgq.mongodb.net:27017,ac-kmyhypw-shard-00-02.tvrnsgq.mongodb.net:27017/devpath?ssl=true&replicaSet=atlas-462cp2-shard-0&authSource=admin&retryWrites=true&w=majority"
  },
  {
    name: "Option 3: Local MongoDB",
    uri: "mongodb://localhost:27017/devpath"
  }
];

async function testConnection(name, uri) {
  console.log(`\n🔄 Testing: ${name}`);
  console.log(`URI: ${uri.substring(0, 50)}...`);
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
  });
  
  try {
    await client.connect();
    console.log("✅ Connected successfully!");
    
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Ping successful!");
    
    const databases = await client.db().admin().listDatabases();
    console.log(`✅ Found ${databases.databases.length} databases`);
    
    return true;
  } catch (error) {
    console.error(`❌ Failed: ${error.message}`);
    return false;
  } finally {
    await client.close();
  }
}

async function testAll() {
  console.log("🚀 Testing MongoDB Connections...\n");
  console.log("=" .repeat(60));
  
  for (const conn of connections) {
    const success = await testConnection(conn.name, conn.uri);
    if (success) {
      console.log("\n" + "=".repeat(60));
      console.log(`✅ SUCCESS! Use this connection string in .env:`);
      console.log(`DATABASE_URL="${conn.uri}"`);
      console.log("=".repeat(60));
      break;
    }
  }
  
  console.log("\n🎯 Recommendation:");
  console.log("If all tests failed, create a NEW MongoDB cluster:");
  console.log("https://cloud.mongodb.com/ → Build Database → M0 (FREE)");
}

testAll();
