const googleTrends = require('google-trends-api');
const startDate ='2023-01-01';
async function recordTrendz(body) {
  try {
    let record = await googleTrends.interestByRegion({keyword: body, startTime: new Date(startDate), endTime: new Date(), 
    geo: ['IN'],resolution:'REGION'})
    let trendz = JSON.parse(record);
    let result = [];
    for(let item of trendz.default.geoMapData){
        if(item.hasData[0] == true){
            result.push({
                "geoName":item.geoName,
                "formattedValue":item.formattedValue[0]
            })
        }
    }
    return result;
  } catch (e) {
    //console.log("Error while recording the trendz", e);
    return e;
  }
}
module.exports = {
    recordTrendz
};
