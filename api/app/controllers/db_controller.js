var api = require("../api.js");
var sql = require('mssql/msnodesqlv8');

var config = {
  driver: 'msnodesqlv8',
  server: 'BRETT-LT-PC',
  database: 'CMPT498',
  options: { trustedConnection: true, useUTC: true }
};

sql.connect(config);

exports.linegraph = function(req, res){

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.lineGraphQuery(req.query.column, req.query.vdsId, req.query.hour, req.query.lowdate, req.query.highdate, req.query.live, res, apiReturn, sql);
}

exports.scatterplot = function(req, res){

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.scatterPlotQuery(req.query.column, req.query.vdsId, req.query.lowdate, req.query.highdate, req.query.live, res, apiReturn, sql);
}

exports.bargraph = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.barChartQuery(res, apiReturn, sql, req.query.lowdate, req.query.highdate);
}

exports.bargraphLanes = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.laneErrorQuery(req.query.VDSID, res, apiReturn, sql, req.query.lowdate, req.query.highdate);
}

exports.hexbin = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.hexbinQuery(req.query.xAxis, req.query.yAxis, req.query.lowdate, req.query.highdate, res, apiReturn, sql);
}

exports.map = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.mapQuery(res, apiReturn, sql);
}

exports.calendar = function(req, res){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.calendarQuery(req.query.column,req.query.year,res,apiReturn, sql);
}

function apiReturn(res, results){
  res.send(results);
}
