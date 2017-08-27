
var sql = require('mssql/msnodesqlv8');

var table1 = "CombinedDTFormat";
var table2 = "warehouse";

function callDB(query, res, callback, sql) {
  console.log(query);
    var request = new sql.Request();
    request.query(query, function(err, records) {
      if(err) {
        console.log(err);
      } else {
        callback(res, records);
        request.cancel();
      }
    });
}


exports.scatterPlotQuery = function(column, vdsId, lowdate, highdate, live, res, callback, sql) {
  console.log("SCATTERPLOT: LowDate:",lowdate,"HighDate:",highdate);
  if (live.match("true")){
    live = true;
  }
  else {
    live = false;
  }
  var table;
  var datetime;
  if(live === true) {
    table = table1;
    datetime = "datetime";
  } else {
    table = table2;
    datetime = "datetime";
  }
  var query = "select " + table + "."+ datetime +", " + table + ".lane, " +
  table + "." + column + " from " + table + ", VDSIDs where ";
  query += DateSplit(table, lowdate, highdate, live);
  query += " and " + table + ".vdsId = " + vdsId  + " and " + table +
  ".vdsId = VDSIDs.vdsId order by " + datetime + ", lane;";
  
  callDB(query, res, callback, sql);

  /*
  var query = "select " + table + "."+ datetime +", " + table + ".lane, " +
  table + "." + column + " from " + table + ", VDSIDs where ";
  query += DateSplit(table, lowdate, highdate, live);
  query += " and " + table+ ".vdsId = " + vdsId + " and " + table +
  ".vdsId = VDSIDs.vdsId order by " + datetime + ", lane;";
  return callDB(query);
  */
}


exports.lineGraphQuery = function(column, vdsId, hour, lowdate, highdate, live, res, callback, sql) {
  console.log("LINEGRAPH: LowDate:",lowdate,"HighDate:",highdate);
  var table;
  var datetime;
  if (live.match("true")){
    live = true;
  }
  else {
    live = false;
  }
  if( live === true ) {
    table = table1;
    datetime = "datetime";
    hour = " and datepart(hh,  " + table + ".datetime) = " + hour;
  } else {
    table = table2;
    datetime = "datetime";
    hour = " and datepart(hh,  " + table + ".datetime) = " + hour;
  }
  var query = "select " + table + "."+ datetime +", " + table + ".lane, " +
  table + "." + column + " from " + table + ", VDSIDs where ";
  query += DateSplit(table, lowdate, highdate, live);
  query += " and " + table + ".vdsId = " + vdsId + " " + hour + " and " + table +
  ".vdsId = VDSIDs.vdsId order by " + datetime + ", lane;";
  callDB(query, res, callback, sql);
}


exports.calendarQuery = function(column, year, res, callback, sql) {

  var query = "select cast(datetime as date) as datetime, avg(" + column +
  ") as aggregate from " + table2 + " where " +
  "datetime is not null and datepart(yyyy, datetime) = " + year +
  " group by cast(datetime as date)";
  callDB(query, res, callback, sql);
}


exports.barChartQuery = function(res, callback, sql, lowdate, highdate) {
  var query = "select vdsId, sum(correct) as correct, sum(incorrect) as incorrect" +
  " from " + table2 + " where vdsId is not null and datetime >= '" +
  lowdate + "' and datetime <= '" + highdate + "' group by vdsId";
  callDB(query, res, callback, sql);
}


exports.laneErrorQuery = function(vdsId, res, callback, sql, lowdate, highdate) {
  var query = "select lane, sum(correct) as correct, sum(incorrect) as incorrect" +
  " from " + table2 + " where vdsId = " + vdsId + " and datetime >= '" + 
  lowdate + "' and datetime <= '" + highdate + "' group by lane";
  callDB(query, res, callback, sql);
}


exports.hexbinQuery = function(xAxis, yAxis, lowdate, highdate, res, callback, sql) {
  var query = "select " + xAxis + ", " + yAxis + " from " + table2 +
  " where " + DateSplit(table2, lowdate, highdate, "false") + " ;";
  callDB(query, res, callback, sql);
}


function completenessQuery(vdsId, lowdate, highdate) {
  var query = "select vdsId, sum(total) as total from " +
  table2 + " where vdsId = " + vdsId +
  " and " + DateSplit(table2, lowdate, highdate, "false") +
  " group by vdsId;";
  return callDB(query);
}

// Splits '2016-09-01 00:00:00.00' type datetimes.
function DateSplit(table,lowdate, highdate, live) {
  if(live === true) {
     return " " + table + ".datetime >= '" + lowdate + "' and " + table + ".datetime <= '" + highdate + "' ";
  } else{;
      return " " + table + ".datetime >= '" + lowdate + "' and " + table + ".datetime <= '" + highdate + "' ";
  }
}

exports.mapQuery = function(res, callback, sql) {
  callDB("select * from VDSIDs", res, callback, sql);
}
