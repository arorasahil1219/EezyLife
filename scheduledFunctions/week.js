const CronJob = require("node-cron");
const {orderTrendzJob} =  require('../controller/order_controller');
exports.initWeekScheduledJobs = () => {
  const scheduledJobFunction = CronJob.schedule("0 0 * * SUN", async() => {
    //console.log("Job schedule at 8 am , initating!");
    await orderTrendzJob();
  });

  scheduledJobFunction.start();
}