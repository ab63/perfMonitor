const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1/perfData", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Machine = require("./models/Machine");

function socketMain(io, socket) {
  let macA;
  socket.on("initPerfData", async (data) => {
    macA = data.macA;
    const response = await checkAndAdd(data);
  });
  socket.on("perfData", (data) => {
    io.emit("data", data);
  });
  Machine.find({}, (err, docs) => {
    docs.forEach((machine) => {
      machine.isActive = false;
      io.emit("data", machine);
    });
  });

  socket.on('disconnect', () => {
    Machine.find({ macA: macA }, (err, docs) => {
      if (docs.length > 0) {
        docs[0].isActive = false;
        io.emit("data", docs[0]);
      }
    });
  });
}

function checkAndAdd(data) {
  return new Promise((resolve, reject) => {
    Machine.findOne({ macA: data.macA }, (err, doc) => {
      if (err) {
        throw err;
        reject(err);
      } else if (doc == null) {
        let machine = new Machine(data);
        machine.save();
        resolve("added");
      } else {
        resolve("found");
      }
    });
  });
}

module.exports = socketMain;
