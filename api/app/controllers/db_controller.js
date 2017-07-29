var api = require("../api.js");
var sql = require('mssql/msnodesqlv8');

var config = {
  driver: 'msnodesqlv8',
  server: 'DESKTOP-L3U7II0',
  database: 'CMPT498',
  options: { trustedConnection: true, useUTC: true }
};

sql.connect(config);

exports.linegraph = function(req, res){ 
  console.log(JSON.stringify(req.query));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.lineGraphQuery(req.query.column, req.query.vdsId, req.query.hour, req.query.lowdate, req.query.highdate, req.query.live, res, apiReturn, sql);
}

exports.scatterplot = function(req, res){
  console.log(JSON.stringify(req.query));
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  api.scatterPlotQuery(req.query.column, req.query.vdsId, req.query.lowdate, req.query.highdate, req.query.live, res, apiReturn, sql);
}

function apiReturn(res, results){
  res.send(results);
}