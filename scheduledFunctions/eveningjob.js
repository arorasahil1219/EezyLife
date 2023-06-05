const CronJob = require("node-cron");
const {syncOrderJob} =  require('../controller/order_controller');
exports.initEveningScheduledJobs = () => {
    const scheduledEveningJobFunction = CronJob.schedule("0 13 * * *", async() => {
   // const scheduledEveningJobFunction = CronJob.schedule("*/15 * * * *", async() => {
    console.log("Job executed for 7 pm initiated!");
    await syncOrderJob();
  });

  scheduledEveningJobFunction.start();
}