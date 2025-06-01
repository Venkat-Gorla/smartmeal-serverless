// - This script is designed to delete all documents from a specific
//   Elasticsearch index.
// - It can be run in a dry-run mode to preview the number of documents that
//   would be deleted without actually performing the deletion.
//
// Usage:
// node es-reset.js --delete [--dry-run]
// - `--delete`: Required flag to indicate that deletion should occur.
// - `--dry-run`: Optional flag to preview the number of documents that would be
//   deleted without actually deleting them.
// - The script uses the Elasticsearch client to count and delete documents based
//   on a match_all query.

import createClient from "../../elastic-search/client.js";
import { getMeals } from "../../elastic-search/query.js";
import { MEALS_INDEX } from "../../elastic-search/constants.js";
import process from "process";

async function queryAllFromIndex() {
  let page = 1;
  const pageSize = 20;
  let currentPage = await getMeals({ page, pageSize });

  while (currentPage.meals.length > 0) {
    processCurrentPage(currentPage);
    page++;
    if (!currentPage.hasNext) break;
    currentPage = await getMeals({ page, pageSize });
  }
}

function processCurrentPage(currentPage) {
  console.log(
    `\nPrinting page number ${currentPage.page}:`,
    JSON.stringify(currentPage, null, 2)
  );
}

async function deleteAllFromIndex(dryRun = false) {
  const client = createClient();

  try {
    const matchQuery = { match_all: {} };
    await printMatchedCount(client, matchQuery);

    if (dryRun) {
      console.log("Dry run enabled. No documents were deleted.");
      return;
    }

    await deleteByQuery(client, matchQuery);
  } catch (err) {
    console.error(
      `Failed operation on index '${MEALS_INDEX}'`,
      err.meta?.body || err
    );
    process.exit(1);
  }
}

async function printMatchedCount(client, matchQuery) {
  const countResult = await client.count({
    index: MEALS_INDEX,
    body: { query: matchQuery },
  });

  const count = countResult.body.count;
  console.log(`Matched ${count} documents in index '${MEALS_INDEX}'`);
}

async function deleteByQuery(client, matchQuery) {
  const result = await client.deleteByQuery({
    index: MEALS_INDEX,
    body: { query: matchQuery },
    refresh: true,
    wait_for_completion: true,
  });

  console.log(
    `Deleted ${result.body.deleted} documents from index '${MEALS_INDEX}'`
  );
}

async function main() {
  const [, , ...args] = process.argv;
  // const indexArg = args.find((arg) => arg.startsWith("--index="));
  const flags = new Set(args);
  const queryFlag = flags.has("--query");
  const deleteFlag = flags.has("--delete");
  const dryRunFlag = flags.has("--dry-run");
  // can have "--summary" flag to log only counts, not full page data

  if (!queryFlag && !deleteFlag) {
    console.error(
      // "Usage: node es-reset.js --delete --index=my-index-name [--dry-run]"
      "Usage: node es-reset.js --query --delete [--dry-run]"
    );
    process.exit(1);
  }

  // const indexName = indexArg.split("=")[1];
  if (queryFlag) {
    await queryAllFromIndex();
  } else if (deleteFlag) {
    await deleteAllFromIndex(dryRunFlag);
  }
}

main();
