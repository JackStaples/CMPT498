
var sql = require('mssql/msnodesqlv8');


var table1 = "[both raw]";
var table2 = "warehouse";
function test() {
  var response;
    //response = calenderQuery('speed');
    //response = lineGraphQuery('speed', '1003', 12, '2016-09-01 00:00:00.00', '2016-09-02 00:00:00.00', true);
    //response = scatterPlotQuery('speed', '1003', '2016-09-01 00:00:00.00', '2016-09-02 00:00:00.00', true);
    //response = hexbinQuery("speed", "occ", '2016-09-01 00:00:00.00', '2016-09-02 00:00:00.00', true);
    //response = barChartQuery();
    //response = laneErrorQuery("1003");
    //response = completenessQuery("1003", '2016-09-01 00:00:00.00', '2016-09-02 00:00:00.00');
    //response = mapQuery();
}


function callDB(query, res, callback) {
  console.log(query);
  var config = {
    driver: 'msnodesqlv8',
    server: 'DESKTOP-L3U7II0',
    database: 'CMPT498',
    options: { trustedConnection: true, useUTC: true }
  };
  sql.close();
  sql.connect(config, function (err) {
    if(err) { console.log(err); }
    var request = new sql.Request();
    request.query(query, function(err, records) {
      if(err) {
        console.log(err);
      } else {
        sql.close();
        console.log(records);
        callback(res, records);
      }
    });
  });
}


function scatterPlotQuery(column, vdsId, lowdate, highdate, live) {
  var table;
  var dt;
  var hour;
  if(live) {
    table = table1;
    dt = "datetime";
  } else {
    hour = "";
    table = table2;
    dt = "dt";
  }
  var query = "select " + table + "."+ dt +", " + table + ".lane, " +
  table + "." + column + " from " + table + ", VDSIDs where ";
  query += DateSplit(table, lowdate, highdate, live);
  query += " and " + table+ ".vdsId = " + vdsId + " and " + table +
  ".vdsId = VDSIDs.vdsId order by " + dt + ", lane;";
  return callDB(query);
}


exports.lineGraphQuery = function(column, vdsId, hour, lowdate, highdate, live, res, callback) {
  var table;
  var dt;
  if( live != "false" ) {
    table = table1;
    hour = " and datepart(hh,  " + table + ".datetime) = " + hour;
    dt = "datetime";
  } else {
    hour = "";
    table = table2;
    dt = "dt";
  }
  var query = "select " + table + "."+ dt +", " + table + ".lane, " +
  table + "." + column + " from " + table + ", VDSIDs where ";
  query += DateSplit(table, lowdate, highdate, live);
  query += " and " + table+ ".vdsId = " + vdsId + " and " + table +
  ".vdsId = VDSIDs.vdsId order by " + dt + ", lane;";
  callDB(query, res, callback);
}


function calenderQuery(column) {
  var query = "select cast(dt as date) as datetime, avg(" + column +
  ") as aggregate from " + table2 + " where " +
  "dt is not null group by cast(dt as date)";
  return callDB(query);
}


function barChartQuery() {
  var query = "select vdsId, sum(correct) as correct, sum(incorrect) as incorrect" +
  " from " + table2 + " where vdsId is not null group by vdsId";
  return callDB(query);
}


function laneErrorQuery(vdsId) {
  var query = "select lane, sum(correct) as correct, sum(incorrect) as incorrect" +
  " from " + table2 + " where vdsId = " + vdsId + " group by lane";
  return callDB(query);
}


function hexbinQuery(xAxis, yAxis, lowdate, highdate) {
  var query = "select " + xAxis + ", " + yAxis + " from " + table2 +
  " where " + DateSplit(table2, lowdate, highdate, false) + " ;";
  return callDB(query);
}


function completenessQuery(vdsId, lowdate, highdate) {
  var query = "select vdsId, sum(total) as total from " +
  table2 + " where vdsId = " + vdsId +
  " and " + DateSplit(table2, lowdate, highdate, false) +
  " group by vdsId;";
  return callDB(query);
}

// Splits '2016-09-01 00:00:00.00' type datetimes.
function DateSplit(table,lowdate, highdate, live) {
  if(live != "false") {
    var today = new Date();
    return " datepart(yyyy, " + table + ".datetime) = " + today.getFullYear() +
    " and datepart(mm, " + table + ".datetime) = " + (today.getMonth()+1) +
    " and datepart(dd, " + table + ".datetime) = " + today.getDate();
  }
    var lowdate = lowdate.split(" ");
    var highdate = highdate.split(" ");
    lowdate = lowdate[0];
    highdate = highdate[0];
    lowdate = lowdate.split("-");
    highdate = highdate.split("-");

    return " datepart(yyyy, " + table + ".dt) >= " + lowdate[0] +
      " and datepart(yyyy, " + table + ".dt) <= " + highdate[0] +
      " and datepart(mm, " + table + ".dt) >= " + lowdate[1] +
      " and datepart(mm, " + table + ".dt) <= " + highdate[1] +
      " and datepart(dd, " + table + ".dt) >= " + lowdate[2] +
      " and datepart(dd, " + table + ".dt) <= " + highdate[2] + " ";
}

function mapQuery() {
  console.log("map querying is running");
  return callDB("select * from VDSIDs");
}
//test();
