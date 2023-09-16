const SellingPartnerAPI = require('amazon-sp-api');

(async() => {
    try {
      let sellingPartner = new SellingPartnerAPI({
        region:'eu', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
        options:{
            only_grantless_operations:false
          },
        refresh_token:'Atzr|IwEBIEDXDR4QK6QB1KjFyk_DotbvZT0-Pkux-sK9yR2C2juhtdl23FLcMAkYq4FkbknT9LTv4pjtkmtqGf_XR2C-v2XS-u166BKebbknvyyrbDdDJnDYslhHLOumpbwxoZJ6vUJy_ogwffu1geN7zeQl6zpQnG_c1gdMnB_Ss9j6gDKTbJQCD3y7TZQvvJiFpIVPM8Yc0BVfW5KFgjlPBzH4Z_ZusdeiKe-rv-0mvfBA5LQgAWssF_jC7o6TWenECkLPUiiokpgo3yOIQs1E20fklsGmkRPXN4xMkGyDAyxXd4TE4VQVu2aUaGWUC-feticPnWEZ9-7K3HbDgkqNKtA4imDG',
       //refresh_token:'Atzr|IwEBIBixwzziBqdQHpS66lc123uUZis4qRiitVu-NEma3-4Kuj0Ifa_etPwU0UQxr3WSqAolI_V2mfhXHMzex_wIkEO1SNPQJLV_GUPjli9IVFfz5ldn-VzFkiL4zE4o7CtlUs41piOxywYU_mvXnfjdUBNK_qFph1Yjs05LqYTLEcfN9MBdIcfKqoscd5aVAhMOKtRlFRi-y8mBXk2oUeaUSQRZWpq1MD7oxAyxOvzUr9mWQG-W4MOPRx49ZlOOu8P1zDJ6XC33zV0m665RQ4VbvAj017E44TwOSCuhucYIbZb-Ooq5m-cLy3hbbXTd4NQr4vMJRKH4KaTIiE66MYMVFh1o' ,
       credentials:{
            SELLING_PARTNER_APP_CLIENT_ID:'amzn1.application-oa2-client.0c96a1e00db3422db9c0412e4a1af32f',
            SELLING_PARTNER_APP_CLIENT_SECRET:'amzn1.oa2-cs.v1.4b5f40ae797fef0867141fc7f8af1a944b374079fb687570d5b868ff3d919f69',
            AWS_ACCESS_KEY_ID:'AKIATKFKC3UGIP4SNXV3',
            AWS_SECRET_ACCESS_KEY:'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',
          //  AWS_SESSION_TOKEN: '<AWS_SESSION_TOKEN>',
            AWS_SELLING_PARTNER_ROLE:'arn:aws:iam::227989970188:role/sellerRoleAws'
          },
      });
      let res = await sellingPartner.callAPI({
        operation:'getOrders',
        endpoint:'orders',
        path:null,
        query:{
          // CreatedAfter:'2023-01-01T00:00:00-07:00',
          LastUpdatedAfter:'2023-05-04T00:00:00-07:00' ,
          MarketplaceIds:['A21TJRUUN4KGV'],
           //OrderStatuses:'Canceled',
           AmazonOrderIds:'407-6411204-5883545'
           //'402-3274604-1475560'
          }
      });
      console.log(res);
    } catch(e){
      console.log(e);
    }
  })();