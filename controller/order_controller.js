let spApi = require("../aws-sp-api/spapi");
let { Op } = require('sequelize');
let {recordTrendz} =require('../services/trendz');
let Order = require("../models/orders");
let OrderDetail = require("../models/orderDetail");
let Customer = require("../models/customers");
let fs = require("fs");
let orderArray = [];
const db = require("../app/models");
const Customers = db.customers;
const myOrders = db.orders;
const myOrderDetails = db.orderDetails;
const customerTrendz = db.customerTrendz;
let moment = require('moment');

const orderList = async (req, res) => {
  try {
    //console.log('req body::',req.body)
    let userDate="2023-04-01T00:00:00-07:00"
    
   // console.log('user date::',userDate)
    let query = {
      MarketplaceIds: ["A21TJRUUN4KGV"],
      CreatedAfter: "2023-04-01T00:00:00-07:00" ,
    };
    if(req.body.fromDate) {
      delete query.CreatedAfter
      userDate=req.body.fromDate + 'T00:00:00-07:00'
      query.LastUpdatedAfter=userDate
    }
    if(req.query.OrderStatuses){
      query.OrderStatuses = req.query.OrderStatuses
    }
    if (req.body?.NextToken) {
      query.NextToken = req.body.NextToken;
    }
    //console.log('query:::',query)
    let customerToken = await Customers.findAll({
      where: { customerId: req.query.customerId },
      attributes: ["customerRefreshToken","customerName"],
      raw: true,
    });
    let getOrderLists = await spApi.execute_sp_api(
      "getOrders",
      "orders",
      null,
      query,
      customerToken[0]["customerRefreshToken"]
    );
    for(let item of getOrderLists.Orders){
        item.customerName = customerToken[0]["customerName"]
    }
    return res.status(200).json({
      message: "list of active orders!",
      response: getOrderLists,
    });
  } catch (err) {
    //console.log("error while listing the order from amazon", err);
    return res.status(500).json({
      message: "Not able to get the order lists",
      response: err,
    });
  }
};

const orderById = async (req, res) => {
  try {
    let query = {
      MarketplaceIds: ["A21TJRUUN4KGV"],
    };
    let path = {
      orderId: req.query.orderId,
    };
    // let customerToken = await getCustomerById(req.query.customerId);
    // //console.log('customer token::::',customerToken);
    let customerToken = await Customers.findAll({
      where: { customerId: req.query.customerId },
      attributes: ["customerRefreshToken"],
      raw: true,
    });
    let getOrderLists = await spApi.execute_sp_api(
      "getOrderItems",
      "orders",
      path,
      query,
      customerToken[0]["customerRefreshToken"]
    );

    return res.status(200).json({
      message: "list of active orders!",
      response: getOrderLists,
    });
  } catch (err) {
    //console.log("error while listing the order from amazon", err);
    return res.status(500).json({
      message: "Not able to get the order lists",
      response: err,
    });
  }
};

const syncOrder = async (req, res) => {
  try {
    let query = {
      MarketplaceIds: ["A21TJRUUN4KGV"],
      CreatedAfter: "2023-04-01T00:00:00-07:00",
    };
   // let destroyOrders = await myOrders.destroy({ truncate : true, cascade: false });
    ////console.log('destory orders:',destroyOrders)
    let getAllCustomerDetails = await Customers.findAll({
      where: { isActive: 1 },
      raw: true,
    });
    for (let customeritem of getAllCustomerDetails) {
      let destroyOrders = await myOrders.destroy({ where : {CustomerId:customeritem.customerId}});
      console.log('destroyOrders::',destroyOrders)
      await delay(3000);
      await getAllOrderDataPagination(
        query,
        customeritem.customerRefreshToken,
        customeritem.customerId
      );

      orderArray = orderArray.flat();
      orderArray.map((o) => (o.customerName = customeritem.customerName));
      ////console.log("my order array", orderArray);
      await putOrderDataInDb(orderArray);
      orderArray = [];
    }
    return res.status(200).json({
      message: "list of active orders!",
      arr: orderArray,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Not able to get the order lists",
      response: err,
    });
  }
};

const syncOrderJob = async () => {
    try {
        // let destroyOrders = await myOrders.destroy({ truncate : true, cascade: false });
        //console.log('destory orders:',destroyOrders)
        //console.log('syncing job now')
      let query = {
        MarketplaceIds: ["A21TJRUUN4KGV"],
        CreatedAfter: "2023-01-04T00:00:00-07:00",
      };
      let getAllCustomerDetails = await Customers.findAll({
        where: { isActive: 1 },
        raw: true,
      });
      for (let customeritem of getAllCustomerDetails) {
        let destroyOrders = await myOrders.destroy({ where : {CustomerId:customeritem.customerId}});
        await delay(3000);
        await getAllOrderDataPagination(
          query,
          customeritem.customerRefreshToken,
          customeritem.customerId
        );
  
        orderArray = orderArray.flat();
        orderArray.map((o) => (o.customerName = customeritem.customerName));
        //console.log("my order array", orderArray);
        await putOrderDataInDb(orderArray);
        orderArray = [];
      }
      await  syncOrderItemJob();
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


const syncOrderItemJob = async () => {
    //let customers = await getAllCustomers();
    let customers = await Customers.findAll({ raw: true });
    //console.log("customers::", customers);
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
          let getOrderDetailById = await spApi.execute_sp_api(
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

function delay(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
async function getAllOrderDataPagination(query, token, customerId) {
  await delay(3000);
  let getOrderLists = await spApi.execute_sp_api(
    "getOrders",
    "orders",
    null,
    query,
    token
  );
  await delay(3000);
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
  let utcDate = originalDate
  // let date = new Date(utcDate);
  // let orderDate  = date.toLocaleString()
  let utc = utcDate.replace('T',' ').replace('Z','')
  let gmtDateTime = moment.utc(utc, "YYYY-MM-DD H:mm:ss")
  let local = gmtDateTime.local().format('YYYY-MM-DD hh:mm:ss');
  let localDate = local.replace(' ','T')
  //let localDate = item.PurchaseDate
  return localDate
}

async function putOrderDataInDb(data) {
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
const syncOrderItems = async (req, res) => {
  let customers = await Customers.findAll({ raw: true , where:{isActive : 1}});
  console.log("customers active::", customers);
  let query = {
    MarketplaceIds: ["A21TJRUUN4KGV"],
  };
  let arr = [];
  for (let cust of customers) {
    console.log('my customer is', cust.customerRefreshToken);
    let orders = await myOrders.findAll({
      where: { CustomerId: cust.customerId },
      attributes: ["AmazonOrderId"],
      raw: true
    });
    let OrderDetails = await myOrderDetails.findAll({
      where: { CustomerId: cust.customerId },
      attributes: ["AmazonOrderId"],
      raw: true
    });
    let orderArr = orders.map((e) => e.AmazonOrderId);
    let OrderDetailArr = OrderDetails.map((e) => e.AmazonOrderId);
    let AWSOrderIdOfCustomer = orderArr.filter(function (obj) {
      return OrderDetailArr.indexOf(obj) == -1;
    });    
    console.log('AWSOrderIdOfCustomer:::',AWSOrderIdOfCustomer);
    if (AWSOrderIdOfCustomer.length > 0) {
      for (let item of AWSOrderIdOfCustomer) {
        let path = {
          orderId: item
        };
        console.log('pth::',path);
        let getOrderDetailById = await spApi.execute_sp_api(
          "getOrderItems",
          "orders",
          path,
          query,
          cust.customerRefreshToken
        );
        console.log('this getOrderDetailById:::',getOrderDetailById);
        if (getOrderDetailById) {
          for(let elem of getOrderDetailById.OrderItems){
            elem.AmazonOrderId  = getOrderDetailById.AmazonOrderId
            elem.CustomerId  = cust.customerId
            arr.push(elem);
          }
        }
      }
    }
    console.log('test array', arr);
    let detilArr = [];
    let AmazonOrderId = [];
    if (arr.length > 0) {
      for (let obj of arr) {
        AmazonOrderId.push(obj.AmazonOrderId);
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
      //console.log('deleting mon orderid if exist::',AmazonOrderId);
      const deleteExisting = await myOrderDetails.destroy({
        where: {
          AmazonOrderId: { [Op.in]: AmazonOrderId }
        }
      })
      //console.log('deleteExisting::',deleteExisting);  
      const res1 = await myOrderDetails.bulkCreate(detilArr);      
    }
  }
  return res.status(200).json({
    message: "Sync updated",
  });
};
const orderTrendz = async (req, res) => {
    try {
      let createTrendz = await recordTrendz(req.body.productName);
      let trendzData =[];
      for(let item of createTrendz){
            trendzData.push({
                geoName:item.geoName,
                formattedValue:item.formattedValue,
                customerId:req.body.customerId,
                productName: req.body.productName
            })
        }
      await customerTrendz.bulkCreate(trendzData)
      return res.status(200).json({
        message: "Created trendz successfully!",
        response: createTrendz,
      });
    } catch (err) {
      //console.log("error while creating the trendz", err);
      return res.status(500).json({
        message: "Not able to create the trendz",
        response: err,
      });
    }
};


const orderTrendzJob = async (req,res) => {
    try {
        let getCustomerQuery  = `select distinct customerId from customerTrendzs`
        let getCustomers = await db.sequelize.query(`${getCustomerQuery}`, {
            raw: true,
          });
          let trendzData =[];
          for(let item of getCustomers[0]){
            let productQuery =`select distinct productName from customerTrendzs where customerId  = '${item.customerId}'`
            let customerProduct = await db.sequelize.query(`${productQuery}`, {
                raw: true,
            });
              //console.log('customerProduct::',customerProduct[0])
              for(let product of customerProduct[0]){
                //console.log('for product::',product.productName);
                let deleteProductQuery =`delete from customerTrendzs where customerId  = '${item.customerId}' and productName= '${product.productName}'`
                let deleteProduct = await db.sequelize.query(`${deleteProductQuery}`, {
                    raw: true,
                });
                let createTrendz = await recordTrendz(product.productName);
                
                for(let p of createTrendz){
                      trendzData.push({
                          geoName:p.geoName,
                          formattedValue:p.formattedValue,
                          customerId:item.customerId,
                          productName: product.productName
                      })
                  }
                await customerTrendz.bulkCreate(trendzData)
               
            }
          }
      return res.status(200).json({
        message: "Created trendz successfully!",
        //response: getOrders,
      });
    } catch (err) {
      //console.log("error while creating the trendz", err);
      return res.status(500).json({
        message: "Not able to create the trendz",
        response: err,
      });
    }
};

const listOrderTrendz = async (req, res) => {
  try {
      const getTrendz = await customerTrendz.findAll(
        {
          where:{customerId:req.query.customerId}
        }
        );
      //console.log('All Trendz', getTrendz);
      return res.status(200).json({
          message: 'trend receive successfully',
          status:200,
          response: getTrendz,
      });
  } catch (err) {
      //console.log("error while listing the trendz", err)
      return res.status(500).json({
          message: "Not able to list the trendz",
          response: err
      })
  };
}


const getOrders = async (req, res) => {
  try {
      const getOrders = await myOrders.findAndCountAll(
        {
          where:{customerId:req.query.customerId},
          offset: Number(req.query?.offset) || 0,
          limit:Number(req.query?.limit) || 20,
         raw:true
        }
        );
      //console.log('Order by customer id', getOrders);
      return res.status(200).json({
          message: 'Orders fetched successfully',
          status:200,
          response: getOrders,
      });
  } catch (err) {
      //console.log("error while listing the orders", err)
      return res.status(500).json({
          message: "Not able to list the orders",
          response: err
      })
  };
}


const getOrderDetials = async (req, res) => {
  try {
      const getOrders = await myOrderDetails.findAndCountAll(
        {
          where:{customerId:req.query.customerId},
          offset: Number(req.query?.offset) || 0,
          limit:Number(req.query?.limit) || 20,
         raw:true
        }
        );
      //console.log('Order detail by customer id', getOrders);
      return res.status(200).json({
          message: 'Order detial fetched successfully',
          status:200,
          response: getOrders,
      });
  } catch (err) {
      //console.log("error while listing the orders", err)
      return res.status(500).json({
          message: "Not able to list the orders",
          response: err
      })
  };
}
const grossSaleCustomerData = async (req, res) => {
  try {
      const grossQuery  = `select distinct AmazonOrderId, PurchaseDate,OrderStatus,OrderTotalAmount, 
      EasyShipShipmentStatus,LatestShipDate  
      from orders 
      where CustomerId='${req.body.customerId}'
      and PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}' `
      
      const summarizeQuery  = `select distinct count(AmazonOrderId) as orderItem , sum(OrderTotalAmount) as totalAmount
      from orders
      where CustomerId='${req.body.customerId}'
      and PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}' `
      let [getResult,summarizeResult] = await Promise.all([db.sequelize.query(`${grossQuery}`, {
        raw: true,
      }),db.sequelize.query(`${summarizeQuery}`, {
            raw: true,
      })
    ])
      
      return res.status(200).json({
          message: 'Gross data found successfully',
          status:200,
          response: getResult[0],
          summarizeResult:summarizeResult[0]
      });
  } catch (err) {
      //console.log("error while fetching the gross sale data", err)
      return res.status(500).json({
          message: "Not able to find the gross sale data ",
          response: err
      })
  };
}

const netSaleCustomerData = async (req, res) => {
  try {
      const netQuery  = `select distinct AmazonOrderId, PurchaseDate,OrderStatus,OrderTotalAmount, 
      EasyShipShipmentStatus,LatestShipDate  
      from orders 
      where CustomerId= '${req.body.customerId}' and OrderStatus in('Shipped','UnShipped')
      and PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}'
      and EasyShipShipmentStatus not in ('ReturnedToSeller','LabelCanceled','Undeliverable','ReturningToSeller','Damaged')
      and OrderStatus not in ('Canceled')
      `
      
      const summarizeQuery  = `select distinct count(AmazonOrderId) as orderItem , sum(OrderTotalAmount) as totalAmount
      from orders
      where CustomerId='${req.body.customerId}' and OrderStatus in('Shipped','UnShipped')
      and PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}' 
      and EasyShipShipmentStatus not in ('ReturnedToSeller','LabelCanceled','Undeliverable','ReturningToSeller','Damaged')
      and OrderStatus not in ('Canceled')
      `
      //console.log('summarizeQuery::',summarizeQuery)
      let [getResult,summarizeResult] = await Promise.all([db.sequelize.query(`${netQuery}`, {
        raw: true,
      }),db.sequelize.query(`${summarizeQuery}`, {
            raw: true,
      })
    ])
      return res.status(200).json({
          message: 'net sale data found successfully',
          status:200,
          response: getResult[0],
          summarizeResult:summarizeResult[0]
      });
  } catch (err) {
      //console.log("error while fetching the net sale data", err)
      return res.status(500).json({
          message: "Not able to find the net sale data ",
          response: err
      })
  };
}


const refundSaleCustomerData = async (req, res) => {
  try {
      const refundQuery  = `select distinct AmazonOrderId, PurchaseDate,OrderStatus,OrderTotalAmount, 
      EasyShipShipmentStatus,LatestShipDate  
      from orders 
      where CustomerId= '${req.body.customerId}' 
      and PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}'
      and EasyShipShipmentStatus = 'ReturnedToSeller'
      `
      
      const summarizeQuery  = `select distinct count(AmazonOrderId) as orderItem , sum(OrderTotalAmount) as totalAmount
      from orders
      where CustomerId='${req.body.customerId}' 
      and PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}' 
      and EasyShipShipmentStatus='ReturnedToSeller'
      `
      //console.log('summarizeQuery::',summarizeQuery)
      let [getResult,summarizeResult] = await Promise.all([db.sequelize.query(`${refundQuery}`, {
        raw: true,
      }),db.sequelize.query(`${summarizeQuery}`, {
            raw: true,
      })
    ])
      return res.status(200).json({
          message: 'net sale data found successfully',
          status:200,
          response: getResult[0],
          summarizeResult:summarizeResult[0]
      });
  } catch (err) {
      //console.log("error while fetching the net sale data", err)
      return res.status(500).json({
          message: "Not able to find the net sale data ",
          response: err
      })
  };
}


const cancelSaleCustomerData = async (req, res) => {
  try {
      const refundQuery  = `select distinct AmazonOrderId, PurchaseDate,OrderStatus,OrderTotalAmount, 
      EasyShipShipmentStatus,LatestShipDate  
      from orders 
      where CustomerId= '${req.body.customerId}' 
      and PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}'
      and EasyShipShipmentStatus = 'LabelCanceled'
      `
      
      const summarizeQuery  = `select distinct count(AmazonOrderId) as orderItem , sum(OrderTotalAmount) as totalAmount
      from orders
      where CustomerId='${req.body.customerId}' 
      and PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}' 
      and EasyShipShipmentStatus='LabelCanceled'
      `
      //console.log('summarizeQuery::',summarizeQuery)
      let [getResult,summarizeResult] = await Promise.all([db.sequelize.query(`${refundQuery}`, {
        raw: true,
      }),db.sequelize.query(`${summarizeQuery}`, {
            raw: true,
      })
    ])
      return res.status(200).json({
          message: 'net sale data found successfully',
          status:200,
          response: getResult[0],
          summarizeResult:summarizeResult[0]
      });
  } catch (err) {
      //console.log("error while fetching the net sale data", err)
      return res.status(500).json({
          message: "Not able to find the net sale data ",
          response: err
      })
  };
}

const getOrderSkuData = async (req, res) => {
  try {
      const refundQuery  = `
      select od.SellerSKU , od.Title,count(*) as skucount from orders o
		  join orderDetails od on o.AmazonOrderId = od.AmazonOrderId
		  where o.EasyShipShipmentStatus = 'Delivered'
      and o.CustomerId= '${req.body.customerId}' 
      and o.PurchaseDate BETWEEN '${req.body.fromDate}' and '${req.body.toDate}'
		  group by od.SellerSKU ,od.Title
		  having count(*) > 0
		  order by skucount desc limit 5
      `    
      let getResult= await db.sequelize.query(`${refundQuery}`, {
        raw: true,
      })
  
      return res.status(200).json({
          message: 'net sale data found successfully',
          status:200,
          response: getResult[0]
      });
  } catch (err) {
      //console.log("error while fetching the net sale data", err)
      return res.status(500).json({
          message: "Not able to find the net sale data ",
          response: err
      })
  };
}


const listCustomerTrend = async (req, res) => {
  try {
      const trendzQuery  = `
      select * from  customerTrendzs`    
      
      let getResult= await db.sequelize.query(`${trendzQuery}`, {
        raw: true,
      })
  
      return res.status(200).json({
          message: 'list trendz dataa',
          status:200,
          response: getResult[0]
      });
  } catch (err) {
      //console.log("error while fetching the net sale data", err)
      return res.status(500).json({
          message: "Not able to list the trendz data",
          response: err
      })
  };
}

module.exports = {
  orderList,
  orderById,
  syncOrder,
  syncOrderItems,
  syncOrderJob,
  orderTrendz,
  orderTrendzJob,
  listOrderTrendz,
  getOrders,
  getOrderDetials,
  grossSaleCustomerData,
  netSaleCustomerData,
  refundSaleCustomerData,
  cancelSaleCustomerData,
  getOrderSkuData,
  listCustomerTrend
};
