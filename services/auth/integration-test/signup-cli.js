import { handler } from "../signup/handler.js";

const [username, password, email] = process.argv.slice(2);

if (!username || !password || !email) {
  console.error("Usage: node signup-cli.js <username> <password> <email>");
  process.exit(1);
}

const event = {
  body: JSON.stringify({ username, password, email }),
};

handler(event).then(console.log).catch(console.error);
