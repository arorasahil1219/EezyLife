const CronJob = require("node-cron");
const {syncOrderJob} =  require('../controller/order_controller');
exports.initScheduledJobs = () => {
  const scheduledJobFunction = CronJob.schedule("0 8 * * *", async() => {
    //console.log("Job schedule at 8 am , initating!");
    //await syncOrderJob();
  });

  scheduledJobFunction.start();
}