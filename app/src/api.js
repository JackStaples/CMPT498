var sql = require('mssql/msnodesqlv8');


var table1 = "[both raw]";
var table2 = "Warehouse";
function test() {
  var response;
    //response = calenderQuery('speed');
    //response = lineGraphQuery('speed', '1003', 12, '2016-09-01 00:00:00.00', '2016-09-02 00:00:00.00', false);
    //response = scatterPlotQuery('speed', '1003', '2016-09-01 00:00:00.00', '2016-09-02 00:00:00.00', false);
    //response = hexbinQuery("speed", "occ", '2016-09-01 00:00:00.00', '2016-09-02 00:00:00.00', false);
    //response = barChartQuery();
    //response = laneErrorQuery("1003");
    //response = completenessQuery("1003", '2016-09-01 00:00:00.00', '2016-09-02 00:00:00.00');
}


function callDB(query) {
  var config = {
    driver: 'msnodesqlv8',
    server: 'DESKTOP-TOSQMFB',
    database: 'CMPT498',
    options: { trustedConnection: true, useUTC: true }
  };
  sql.close();
  return sql.connect(config, function (err) {
    if(err) { console.log(err); }
    var request = new sql.Request();
    return request.query(query, function(err, records) {
      if(err) {
        console.log(err);
      } else {
        sql.close();
        return records;
      }
    });
  });
}


function scatterPlotQuery(column, vdsId, lowdate, highdate, live) {
  var table;
  var dt;
  if(live) {
    table = table1;
    dt = "datetime";
  } else {
    hour = "";
    table = table2;
    dt = "dt";
  }
  var query = "select " + dt +", lane, " + column + " from " + table + " where ";
  query += DateSplit(lowdate, highdate, live);
  query += " and vdsId = " + vdsId + " order by " + dt + ", lane;";
  return callDB(query);
}


function lineGraphQuery(column, vdsId, hour, lowdate, highdate, live) {
  var table;
  var dt;
  if(live) {
    hour = " and datepart(hh, datetime) = " + hour;
    table = table1;
    dt = "datetime";
  } else {
    hour = "";
    table = table2;
    dt = "dt";
  }
  var query = "select " + dt + ", lane, " + column + " from " + table + " where ";
  query += DateSplit(lowdate, highdate, live);
  query += hour;
  query += " and vdsId = " + vdsId + " order by " + dt + ", lane;";
  return callDB(query);
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
  " where " + DateSplit(lowdate, highdate, false) + " ;";
  return callDB(query);
}


function completenessQuery(vdsId, lowdate, highdate) {
  var query = "select vdsId, sum(total) as total from " +
  table2 + " where vdsId = " + vdsId +
  " and " + DateSplit(lowdate, highdate, false) +
  " group by vdsId;";
  return callDB(query);
}

// Splits '2016-09-01 00:00:00.00' type datetimes.
function DateSplit(lowdate, highdate, live) {
  if(live) {
    var today = new Date();
    return "datepart(yyyy, datetime) = " + today.getFullYear() +
    " and datepart(mm, datetime) = " + (today.getMonth()+1) +
    " and datepart(dd, datetime) = " + today.getDate()
  }
    var lowdate = lowdate.split(" ");
    var highdate = highdate.split(" ");
    lowdate = lowdate[0];
    highdate = highdate[0];
    lowdate = lowdate.split("-");
    highdate = highdate.split("-");

    return "datepart(yyyy, dt) >= " + lowdate[0] +
      " and datepart(yyyy, dt) <= " + highdate[0] +
      " and datepart(mm, dt) >= " + lowdate[1] +
      " and datepart(mm, dt) <= " + highdate[1] +
      " and datepart(dd, dt) >= " + lowdate[2] +
      " and datepart(dd, dt) <= " + highdate[2] + " ";
}

test();
