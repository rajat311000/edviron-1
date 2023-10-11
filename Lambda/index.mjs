import { MongoClient } from "mongodb";

async function handler() {
  const url = "mongodb+srv://assignment:edviron@cluster0.ebxruu8.mongodb.net";
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const currentDate = new Date();

  try {
    await client.connect();
    const db = client.db("test");
    const studentsCollection = db.collection("students");
    const duesCollection = db.collection("dues");

    const dues = await duesCollection
      .find({ due_date: { $lt: currentDate } })
      .toArray();

    const studentIds = dues.map((due) => due.student);

    const students = await studentsCollection
      .find({ _id: { $in: studentIds } })
      .toArray();

    const response = {
      statusCode: 200,
      body: students,
    };

    return response;
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    };
  } finally {
    client.close();
  }
}

export { handler };
