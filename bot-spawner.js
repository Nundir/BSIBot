/* eslint no-console: "off" */

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const count = 1;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < 1; i += 1) {
    cluster.fork({
      shardId: i,
      shardsNumber: count,
    });
  }

  cluster.on('exit', (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const shardId = parseInt(process.env.shardId, 10);
  const shardsNumber = parseInt(process.env.shardsNumber, 10);

  require('./src/bot-worker');
  bot.utils.log(`Worker ${process.pid} started | Shard ${shardId + 1}/${shardsNumber}`, 'info');
}
