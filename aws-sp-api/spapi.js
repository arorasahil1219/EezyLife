// const SellingPartnerAPI = require("amazon-sp-api");

// async function execute_sp_api(operation, endpoint, path, query, refreshToken) {
//   try {
//     let sellingPartner = new SellingPartnerAPI({
//       region: "eu",
//       options: {
//         only_grantless_operations: false,
//       },
//       refresh_token: refreshToken,
//       credentials: {
//         SELLING_PARTNER_APP_CLIENT_ID:
//           "amzn1.application-oa2-client.65458ab2d81f49c3bc62ad0bc728194c",
//         SELLING_PARTNER_APP_CLIENT_SECRET:
//           "29ae6d6e75d78871f7d2c5ccd913c678a6224e4e3c440117e6a9ac2cb1f705d2",
//         AWS_ACCESS_KEY_ID: "AKIATYB6BSGNUBWW6KMU",
//         AWS_SECRET_ACCESS_KEY: "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",
//         AWS_SELLING_PARTNER_ROLE:
//           "arn:aws:iam::257828163995:role/SellingPartnerAPI-Role",
//       },
//     });
//     let res = await sellingPartner.callAPI({
//       operation: operation,
//       endpoint: endpoint,
//       path: path,
//       query: query,
//     });
//     return res;
//   } catch (e) {
//     console.log("error sppi::::", e);
//   }
// }
// module.exports = {
//   execute_sp_api,
// };


const SellingPartnerAPI = require("amazon-sp-api");

async function execute_sp_api(operation, endpoint, path, query, refreshToken) {
  try {
    let sellingPartner = new SellingPartnerAPI({
      region: "eu",
      options: {
        only_grantless_operations: false,
      },
      refresh_token: refreshToken,
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID:
          "amzn1.application-oa2-client.1a034e7b30744a1bbb980733b65c956a",
        SELLING_PARTNER_APP_CLIENT_SECRET:
          "465f4c2f8528633f6c3e51760a433230342943c83922fa48aa3ab052078e82f5",
        AWS_ACCESS_KEY_ID: "AKIATKFKC3UGIP4SNXV3",
        AWS_SECRET_ACCESS_KEY: "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",
        AWS_SELLING_PARTNER_ROLE:
          "arn:aws:iam::227989970188:role/sellerRoleAws",
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
