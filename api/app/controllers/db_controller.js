var api = require("../api.js");

exports.linegraph = function(req, res){ 
  console.log(JSON.stringify(req.query));
  api.lineGraphQuery(req.query.column, req.query.vdsId, req.query.hour, req.query.lowdate, req.query.highdate, req.query.live, res, apiReturn);
}
function apiReturn(res, results){
  res.send(results);
}