// dependency list:
// process.env.MEALS_TABLE

// This test will aid in react client integration testing, it will insert and
// optionally delete dynamo db records that will get indexed into ES.
// The records are chosen to be readable and sortable by mealId.
// Note: the ES indexer Lambda currently ignores record deletions, so even if
// the records get deleted from dynamo, they will be retained inside ES. You
// can use a separate script to cleanup ES itself. Happy testing and learning!

import {
  DynamoDBClient,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { Command } from "commander";

const REGION = "us-east-1";
const TABLE_NAME = process.env.MEALS_TABLE;
const client = new DynamoDBClient({ region: REGION });
const userId = "user-int";
const now = new Date();

const program = new Command();
program
  .option("--insert <number>", "Insert N sample meals", parseInt)
  .option("--delete", "Delete inserted meals after test")
  .parse(process.argv);

const options = program.opts();
let insertedMealIds = [];

function generateMeal(index) {
  const mealId = `meal-${String(index + 1).padStart(3, "0")}`; // meal-001, meal-002
  insertedMealIds.push(mealId);
  return {
    PutRequest: {
      Item: {
        mealId: { S: mealId },
        userId: { S: userId },
        title: { S: `title-${index + 1}` },
        description: { S: `description-${index + 1}` },
        createdAt: {
          S: new Date(now.getTime() + (index + 1) * 1000).toISOString(),
        },
        likes: { N: "0" },
        imageUrl: { S: "https://example.com/int-meal.jpg" },
      },
    },
  };
}

async function insertMeals(n) {
  const batches = [];
  for (let i = 0; i < n; i += 25) {
    batches.push(
      client.send(
        new BatchWriteItemCommand({
          RequestItems: {
            [TABLE_NAME]: Array.from({ length: Math.min(25, n - i) }, (_, j) =>
              generateMeal(i + j)
            ),
          },
        })
      )
    );
  }
  await Promise.all(batches);
  console.log(`Inserted ${n} meal records.`);
}

async function deleteMeals() {
  const batches = [];
  for (let i = 0; i < insertedMealIds.length; i += 25) {
    const keys = insertedMealIds.slice(i, i + 25).map((mealId) => ({
      mealId: { S: mealId },
    }));

    batches.push(
      client.send(
        new BatchWriteItemCommand({
          RequestItems: {
            [TABLE_NAME]: keys.map((Key) => ({ DeleteRequest: { Key } })),
          },
        })
      )
    );
  }
  await Promise.all(batches);
  console.log(`Deleted ${insertedMealIds.length} meal records.`);
}

(async () => {
  if (options.insert) {
    await insertMeals(options.insert);
    if (options.delete) {
      await deleteMeals();
    }
  } else {
    console.log("Nothing to do. Use --insert <number> [--delete]");
  }
})();
