const zmq = require("zeromq/v5-compat");
const sock = zmq.socket("rep");

(async () => {
  await sock.bind("tcp://localhost:3000");
  console.log("Ready for game...");

  let min, max;

  sock.on("message", (msg) => {
    const request = JSON.parse(msg.toString());
    console.log("Received:", request);

    if (request.range) {
      [min, max] = request.range.split("-").map(Number);
      guessAndSend();
    } else if (request.hint) {
      if (request.hint === "more") {
        min = lastGuess + 1;
      } else if (request.hint === "less") {
        max = lastGuess - 1;
      }
      guessAndSend();
    }
  });

  let lastGuess;

  function guessAndSend() {
    lastGuess = Math.round(Math.random() * (max - min) + min);
    sock.send(JSON.stringify({ answer: lastGuess }));
  }
})();
