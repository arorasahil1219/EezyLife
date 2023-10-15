
let orderArray = [];
const moment = require('moment') 
const AWS = require("aws-sdk");
const SellingPartnerAPI = require("amazon-sp-api");
const db = require("../app/models");
const cp = require('child_process');
const Customers = db.customers;
const myOrders = db.orders;
const myOrderDetails = db.orderDetails;
const customerTrendz = db.customerTrendz;
require('dotenv').config();
console.log('initiate child process:',process.argv[1],process.argv[2],process.argv[3])
const customerSyncOrders = async (customerId,syncStart) => {
    try {
      console.log('customer sync Process')
      console.log('customerid is::',customerId)
      console.log('syncStart is::',syncStart)
      let query = {
        MarketplaceIds: ["A21TJRUUN4KGV"],
        CreatedAfter:syncStart //  req.body.startDate //"2023-04-01T00:00:00-07:00",
      };
      const dbQuery  = `
      select * from customers c
      join awsSellerApp a on a.id = c.sellerAppId
      where c.isActive = 1 and c.customerId='${customerId}'
      `    
      
      let getAllCustomerDetails= await db.sequelize.query(`${dbQuery}`, {
        raw: true,
      })
      getAllCustomerDetails = getAllCustomerDetails[0]
    //   let getAllCustomerDetails = await Customers.findAll({
    //     where: { 
    //       isActive: 1, 
    //       customerId:customerId
    //     },
    //     raw: true,
    //   });
      console.log('getAllCustomerDetails::',getAllCustomerDetails)
      for (let customeritem of getAllCustomerDetails) {
        let destroyOrders = await myOrders.destroy({ where : {CustomerId:customeritem.customerId}});
        // await delay(3000);
        await getAllOrderDataPagination(
          query,
          customeritem.customerRefreshToken,
          customeritem.customerId
        );
        orderArray = orderArray.flat();
        console.log('order array from child::',orderArray);
        orderArray.map((o) => (o.customerName = customeritem.customerName));      
        await putOrderDataInDb(orderArray);
        orderArray = [];
      }
      await  syncCustomerDetailOrderJob(customerId);
      await sendMailNow();
      return {
        message: "list of active orders!",
        arr: orderArray,
      };
    } catch (err) {
      return {
        message: "Not able to get the order lists",
        response: err,
      };
    }
  };

  async function getAllOrderDataPagination(query, token, customerId) {
    console.log('from child::::')
    console.log('query from child::::',query)
    console.log('token from child::::',token)
    console.log('customerId from child::::',customerId)
    //await delay(3000);
    let getOrderLists = await execute_sp_api(
      "getOrders",
      "orders",
      null,
      query,
      token
    );
    //await delay(3000);
    orderArray.push(getOrderLists.Orders);
    orderArray = orderArray.flat();
    // orderArray.map(o => o.customerId = customerId)
    if (!getOrderLists?.NextToken) {
      delete query.NextToken;
      orderArray.map((o) => (o.customerId = customerId));
      return orderArray;
    } else if (getOrderLists?.Orders) {
      query.NextToken = getOrderLists?.NextToken;
      await getAllOrderDataPagination(query, token, customerId);
    }
  }

  async function refactorDate(originalDate){
    console.log('refactorDate:::',originalDate)
    let utcDate = originalDate
    // let date = new Date(utcDate);
    // let orderDate  = date.toLocaleString()
    let utc = utcDate.replace('T',' ').replace('Z','')
    let gmtDateTime = moment.utc(utc, "YYYY-MM-DD H:mm:ss")
    let local = gmtDateTime.local().format('YYYY-MM-DD hh:mm:ss');
    let localDate = local.replace(' ','T')
    //let localDate = item.PurchaseDate
    console.log('local date is',localDate)
    return localDate
  }
  async function putOrderDataInDb(data) {
    console.log('putting order details in db ')
    let arr = [];
    for (let item of data) {
      //console.log('item.PurchaseDate original date:::::',item.PurchaseDate)
     // let localDate = new Date(item.PurchaseDate);
     // let localDate = item.PurchaseDate
      //console.log('localDate.toLocaleDateString():::',localDate.toLocaleDateString())
      //console.log('localDate.toLocaleTimeString():::',localDate.toLocaleTimeString())
      let localDate =await refactorDate(item.PurchaseDate)
      console.log('item.AmazonOrderId',item.AmazonOrderId);
      console.log('localdate is:',localDate);
      //let utcDate =  item.PurchaseDate // '2023-02-02T05:59:26Z';
      // let date = new Date(utcDate);
      // let orderDate  = date.toLocaleString()
      //let utc = utcDate.replace('T',' ').replace('Z','')
      //let gmtDateTime = moment.utc(utc, "YYYY-MM-DD H:mm:ss")
      //let local = gmtDateTime.local().format('YYYY-MM-DD hh:mm:ss');
      //let localDate = local.replace(' ','T')
      //let localDate = item.PurchaseDate 
      let obj = {
        BuyerEmail: item.BuyerInfo?.BuyerEmail,
        AmazonOrderId: item.AmazonOrderId,
        EarliestDeliveryDate: item.EarliestDeliveryDate,
        EarliestShipDate: item.EarliestShipDate,
        SalesChannel: item.SalesChannel,
        HasAutomatedShippingSettings:
          item.AutomatedShippingSettings?.HasAutomatedShippingSettings,
        OrderStatus: item.OrderStatus,
        IsPremiumOrder: item.IsPremiumOrder,
        IsPrime: item.IsPrime,
        FulfillmentChannel: item.FulfillmentChannel,
        NumberOfItemsUnshipped: item.NumberOfItemsUnshipped,
        HasRegulatedItems: item.HasRegulatedItems,
        IsReplacementOrder: item.IsReplacementOrder,
        IsSoldByAB: item.IsSoldByAB,
        LatestShipDate: item.LatestShipDate,
        ShipServiceLevel: item.ShipServiceLevel,
        DefaultShipFromLocAddressLine2:
          item.DefaultShipFromLocationAddress?.AddressLine2 || null,
        DefaultShipFromLocStateOrRegion:
          item.DefaultShipFromLocationAddress?.StateOrRegion || null,
        DefaultShipFromLocAddressLine1:
          item.DefaultShipFromLocationAddress?.AddressLine1 || null,
        DefaultShipFromLocPostalCode:
          item.DefaultShipFromLocationAddress?.PostalCode || null,
        DefaultShipFromLocCity: item.DefaultShipFromLocationAddress?.City || null,
        DefaultShipFromLocCountryCode:
          item.DefaultShipFromLocationAddress?.CountryCode || null,
        DefaultShipFromLocName: item.DefaultShipFromLocationAddress?.Name || null,
        IsISPU: item.IsISPU,
        MarketplaceId: item.MarketplaceId,
        LatestDeliveryDate: item.LatestDeliveryDate,
        PurchaseDate: localDate,//localDate.toLocaleDateString(),
        PurchaseTime:item.PurchaseDate,
        ShippingAddressStateOrRegion: item.ShippingAddress?.StateOrRegion || null,
        ShippingAddressPostalCode: item.ShippingAddress?.PostalCode || null,
        ShippingAddressCity: item.ShippingAddress?.City || null,
        ShippingAddressCountryCode: item.ShippingAddress?.CountryCode || null,
        IsAccessPointOrder: item.IsAccessPointOrder,
        PaymentMethod: item.PaymentMethod,
        IsBusinessOrder: item.IsBusinessOrder,
        OrderTotalCurrencyCode: item.OrderTotal?.CurrencyCode || null,
        OrderTotalAmount: item.OrderTotal?.Amount || "NOT PAID",
        EasyShipShipmentStatus: item.EasyShipShipmentStatus,
        IsGlobalExpressEnabled: item.IsGlobalExpressEnabled,
        LastUpdateDate: item.LastUpdateDate,
        ShipmentServiceLevelCategory: item.ShipmentServiceLevelCategory,
        CustomerId: item.customerId,
        CustomerName: item.customerName,
      };
      arr.push(obj);
    }
    const res1 = await myOrders.bulkCreate(arr, {
      updateOnDuplicate: ["AmazonOrderId",
       "BuyerEmail",
        "AmazonOrderId",
        "EarliestDeliveryDate",
        "EarliestShipDate",
        "SalesChannel",
        "HasAutomatedShippingSettings",
        "OrderStatus",
        "IsPremiumOrder",
        "IsPrime",
        "FulfillmentChannel",
        "NumberOfItemsUnshipped",
        "HasRegulatedItems",
        "IsReplacementOrder",
        "IsSoldByAB",
        "LatestShipDate",
        "ShipServiceLevel",
        "DefaultShipFromLocAddressLine2",
        "DefaultShipFromLocStateOrRegion",
        "DefaultShipFromLocAddressLine1",
        "DefaultShipFromLocPostalCode",
        "DefaultShipFromLocCity",
        "DefaultShipFromLocCountryCode",
        "DefaultShipFromLocName",
        "IsISPU",
        "MarketplaceId",
        "LatestDeliveryDate",
        "ShippingAddressStateOrRegion",
        "ShippingAddressPostalCode",
        "ShippingAddressCity",
        "ShippingAddressCountryCode",
        "IsAccessPointOrder",
        "PaymentMethod",
        "IsBusinessOrder",
        "OrderTotalCurrencyCode",
        "OrderTotalAmount",
        "EasyShipShipmentStatus",
        "IsGlobalExpressEnabled",
        "PurchaseDate",
        "PurchaseTime",
        "LastUpdateDate",
        "ShipmentServiceLevelCategory",
        "CustomerId",
        "CustomerName"
  ],
    });
    return res1;
  }
  async function execute_sp_api(operation, endpoint, path, query, refreshToken) {
    try {
      console.log("operation",operation)
      console.log("endpoint",endpoint)
      console.log("path",path)
      console.log("query",query)
      console.log("refreshToken",refreshToken)
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
const syncCustomerDetailOrderJob = async (customerId) => {
  //let customers = await getAllCustomers();
  let customers = await Customers.findAll({ 
    isActive: 1, 
    customerId:customerId,
    raw: true 
  }); 
  let query = {
    MarketplaceIds: ["A21TJRUUN4KGV"],
  };
  let arr = [];
  for (let cust of customers) {
    let orders = await myOrders.findAll({
      //CustomerId:cust.customerId,
      where: { CustomerId: cust.customerId },
      attributes: ["AmazonOrderId"],
      raw: true,
    });
    let OrderDetails = await myOrderDetails.findAll({
      where: { CustomerId: cust.customerId },
      //CustomerId:cust.customerId,
      attributes: ["AmazonOrderId"],
      raw: true,
    });
    let orderArr = orders.map((e) => e.AmazonOrderId);
    let OrderDetailArr = OrderDetails.map((e) => e.AmazonOrderId);
    let AWSOrderIdOfCustomer = orderArr.filter(function (obj) {
      return OrderDetailArr.indexOf(obj) == -1;
    });
    //let AWSOrderIdOfCustomer = await Order.find({CustomerId:cust.customerId}).select('AmazonOrderId');
    if (AWSOrderIdOfCustomer.length > 0) {
      for (let item of AWSOrderIdOfCustomer) {
        let path = {
          orderId: item, //item.AmazonOrderId
        };
        let getOrderDetailById = await execute_sp_api(
          "getOrderItems",
          "orders",
          path,
          query,
          cust.customerRefreshToken
        );
        if (getOrderDetailById) {
          getOrderDetailById.OrderItems[0]["AmazonOrderId"] =
            getOrderDetailById.AmazonOrderId;
          getOrderDetailById.OrderItems[0]["CustomerId"] = cust.customerId;
          arr.push(getOrderDetailById.OrderItems[0]);
        }
      }
    }
    let detilArr = [];
    if (arr.length > 0) {
      for (let obj of arr) {
        let newObj = {
          NumberOfItems: obj.ProductInfo.NumberOfItems,
          ItemTaxCurrencyCode: obj.ItemTax?.CurrencyCode || null,
          ItemTaxAmount: obj.ItemTax?.Amount || null,
          ItemPriceCurrencyCode: obj.ItemPrice?.CurrencyCode || null,
          ItemPriceAmount: obj.ItemPrice?.Amount || null,
          ASIN: obj.ASIN,
          SellerSKU: obj.SellerSKU,
          Title: obj.Title,
          SerialNumberRequired: obj.SerialNumberRequired,
          IsGift: obj.IsGift,
          ConditionSubtypeId: obj.ConditionSubtypeId,
          IsTransparency: obj.IsTransparency,
          QuantityOrdered: obj.QuantityOrdered,
          PromotionDiscountTaxCurrencyCode:
            obj.PromotionDiscountTax?.CurrencyCode || null,
          PromotionDiscountTaxAmount:
            obj.PromotionDiscountTax?.Amount || "NOT PAID",
          ConditionId: obj.ConditionId,
          PromotionDiscountCurrencyCode:
            obj.PromotionDiscount?.CurrencyCode || null,
          PromotionDiscountAmount: obj.PromotionDiscount?.Amount || null,
          OrderItemId: obj.OrderItemId,
          AmazonOrderId: obj.AmazonOrderId,
          CustomerId: obj.CustomerId,
        };
        detilArr.push(newObj);
      }
    }
    if (detilArr.length > 0) {
      const res1 = await myOrderDetails.bulkCreate(detilArr);
      //console.log("res1::::", res1);
    }
  }
  return {
    message: "Sync updated",
  };
};
  customerSyncOrders(process.argv[2],process.argv[3])



  async function sendMailNow(){
    AWS.config.update({
      accessKeyId: "AKIATKFKC3UGANVFXWFX",
      secretAccessKey: "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",
      region: "ap-south-1"
    });
  
  const ses = new AWS.SES({ apiVersion: "2010-12-01" });
  const params = {
    Destination: {
      ToAddresses: ["aroramailereezylife@gmail.com"] // Email address/addresses that you want to send your email
    },
    //ConfigurationSetName: <<ConfigurationSetName>>,
    Message: {
      Body: {
        Html: {
          // HTML Format of the email
          Charset: "UTF-8",
          Data:
            "<html><body><h1>Hello  User</h1><p style='color:red'>Data Synced</p> <p>Time 1517831318946</p></body></html>"
        },
        Text: {
          Charset: "UTF-8",
          Data: "Hello User, Data has been synced"
        }
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Test email"
      }
    },
    Source: "aroramailereezylife@gmail.com"
  };
  
  const sendEmail = ses.sendEmail(params).promise();
  
  sendEmail
    .then(data => {
      console.log("email submitted to SES", data);
    })
    .catch(error => {
      console.log(error);
    });
  }