const { MongoClient } = require("mongodb");

async function connect(db_name, collection_name, query_type) {
  const url = "mongodb://localhost:27017";
  const client = new MongoClient(url);

  try {
    await client.connect();
    await query(client, query_type);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }

  async function query(client, query_type) {
    switch (query_type) {
      case "find":
        const cursor = await client
          .db(db_name)
          .collection(collection_name)
          .find({});
        const result = await cursor.toArray();

        console.log("Result: ", result);
        break;

      default:
        break;
    }
  }
}

connect("my_db", "news", "find");
