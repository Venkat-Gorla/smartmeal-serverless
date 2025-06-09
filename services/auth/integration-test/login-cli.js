import { handler } from "../login/handler.js";

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error("Usage: node login-cli.js <username> <password>");
  process.exit(1);
}

const event = {
  body: JSON.stringify({ username, password }),
};

handler(event).then(console.log).catch(console.error);
// handler(event)
//   .then((res) => {
//     const body = JSON.parse(res.body);
//     console.log("AccessToken:", body.accessToken);
//   })
//   .catch(console.error);
