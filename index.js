const express = require("express");
const AWS = require("aws-sdk");
const app = express();
require('dotenv').config();

//Credentials
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const lambda = new AWS.Lambda();

app.get("/defaulters", async (req, res) => {
  const params = {
    FunctionName: "GetDefaultersList",
    InvocationType: "RequestResponse",
  };

  try {
    const response = await lambda.invoke(params).promise();
    const result = JSON.parse(response.Payload);
    res.json(result);
  } catch (error) {
    console.error("Error invoking Lambda function:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
