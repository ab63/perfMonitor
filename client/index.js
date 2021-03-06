const os = require("os");
const io = require("socket.io-client");
let socket = io("http://localhost:8181");

socket.on("connect", () => {
  const nI = os.networkInterfaces();
  let macA;

  for (let key in nI) {
    if (!nI[key][0].internal) {
      macA = nI[key][0].mac;
      break;
    }
  }

  performanceData().then((data) => {
    data.macA = macA;
    socket.emit("initPerfData", data);
  });

  let perfDataInterval = setInterval(() => {
    performanceData().then((data) => {
      data.macA = macA;
      socket.emit("perfData", data);
    });
  }, 1000);

  socket.on("disconnect", () => {
    clearInterval(perfDataInterval);
  });
});

function performanceData() {
  return new Promise(async (resolve, reject) => {
    const osType = os.type() == "Darwin" ? "Mac" : os.type();

    const upTime = os.uptime();

    const freeMem = os.freemem();
    const totalMem = os.totalmem();
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;

    const cpus = os.cpus();
    const cpuModel = cpus[0].model;
    const cpuSpeed = cpus[0].speed;
    const numCores = cpus.length;
    const cpuLoad = await getCpuLoad();
    const isActive =true;

    resolve({
      freeMem,
      totalMem,
      usedMem,
      memUsage,
      osType,
      upTime,
      cpuModel,
      numCores,
      cpuSpeed,
      cpuLoad,
      isActive
    });
  });
}

function cpuAverage() {
  const cpus = os.cpus();
  let idleMs = 0;
  let totalMs = 0;

  cpus.forEach((core) => {
    for (type in core.times) {
      totalMs += core.times[type];
    }
    idleMs += core.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
}

function getCpuLoad() {
  return new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;

      const percentCpu = 100 - Math.floor((100 * idleDiff) / totalDiff);
      resolve(percentCpu);
    }, 100);
  });
}
