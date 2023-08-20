// const SellingPartnerAPI = require("amazon-sp-api");
//Atzr|IwEBIFC_3VZbdUSjvLx8zURgW6YsaZdwpmtpD1RaBvmTz5_cR9UONXXYdMcB7ZEw0SvD9G2TDuG261Q_FEvaXMULuAjEZYFwcDRibUU6GGphg_T-RqwAxT_maWUJ5npvKTzG0kapU--FaXfxJrVN4Xp1i4pgd2Yi-Nz0ygVpQ2aB1zxxu6l1cfvL7qVj-LX69w0dyGZkutJN5MVtbNHs3BQaBPyGuZ_3WQOlP2MFg7-YXyJCDFnavyhAyGQNOsqEImxMEGLDfvc-n3KVrtfZNZFsjiK589DMQA2H9Pvhya5GH7ROCY9LMJQNf7g8GHSLpPAA9DYXrRre-0shDaE-CydMuGsh
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
          "amzn1.application-oa2-client.923dfaeab155477895fe588fb35db709",
        SELLING_PARTNER_APP_CLIENT_SECRET:
          "amzn1.oa2-cs.v1.f2771c3ec4b017288eb310b0ecb706047e7084c0814150f9cdcee7b520978ae2",
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
