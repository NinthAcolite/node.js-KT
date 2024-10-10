const zmq = require("zeromq/v5-compat");
const sock = zmq.socket("req");
const [, , min, max] = process.argv;

if (!min || !max) {
  console.error("Please provide a valid range");
  process.exit(1);
}

const secretNumber = Math.round(Math.random() * (max - min) + parseInt(min));
console.log(`Secret number is ${secretNumber}`);

sock.connect("tcp://localhost:3000");
sock.send(JSON.stringify({ range: `${min}-${max}` }));

sock.on("message", (msg) => {
  const response = JSON.parse(msg.toString());
  console.log("Received:", response);

  if (response.answer < secretNumber) {
    sock.send(JSON.stringify({ hint: "more" }));
  } else if (response.answer > secretNumber) {
    sock.send(JSON.stringify({ hint: "less" }));
  } else {
    console.log("Server guessed the correct number!");
    process.exit(0);
  }
});
