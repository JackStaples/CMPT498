var api = require("../api.js");

exports.linegraph = function(req, res){ 
  console.log(JSON.stringify(req.query));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.lineGraphQuery(req.query.column, req.query.vdsId, req.query.hour, req.query.lowdate, req.query.highdate, req.query.live, res, apiReturn);
}

exports.scatterplot = function(req, res){
  console.log(JSON.stringify(req.query));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.scatterPlotQuery(req.query.column, req.query.vdsId, req.query.lowdate, req.query.highdate, req.query.live, res, apiReturn);
}

exports.calendar = function(req, res){
  console.log(JSON.stringify(req.query));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.calendarQuery(req.query.column,req.query.year,res,apiReturn);
}

function apiReturn(res, results){
  res.send(results);
}