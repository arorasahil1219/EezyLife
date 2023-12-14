const SellingPartnerAPI = require("amazon-sp-api");
require('dotenv').config();
async function execute_sp_api(operation, endpoint, path, query, refreshToken) {
  try {
    // console.log("operation",operation)
    // console.log("endpoint",endpoint)
    // console.log("path",path)
    // console.log("query",query)
    console.log("refreshToken",refreshToken)
    // console.log({
    //   SELLING_PARTNER_APP_CLIENT_ID:process.env.SELLING_PARTNER_APP_CLIENT_ID,
    //   SELLING_PARTNER_APP_CLIENT_SECRET:process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
    //   AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    //   AWS_SECRET_ACCESS_KEY:process.env.AWS_SECRET_ACCESS_KEY,
    //   AWS_SELLING_PARTNER_ROLE:process.env.AWS_SELLING_PARTNER_ROLE          
    // })
    let sellingPartner = new SellingPartnerAPI({
      region: "eu",
      options: {
        only_grantless_operations: false,
      },
      refresh_token: refreshToken,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID:process.env.SELLING_PARTNER_APP_CLIENT_ID,
        SELLING_PARTNER_APP_CLIENT_SECRET:process.env.SELLING_PARTNER_APP_CLIENT_SECRET,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY:process.env.AWS_SECRET_ACCESS_KEY,
        AWS_SELLING_PARTNER_ROLE:process.env.AWS_SELLING_PARTNER_ROLE          
      },
    });

    let res = await sellingPartner.callAPI({
      operation: operation,
      endpoint: endpoint,
      path: path,
      query: query,
    });
    return res;
  } catch (e) {
    console.log("error sppi::::", e);
  }
}
module.exports = {
  execute_sp_api,
};
