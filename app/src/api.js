var sql = require('mssql/msnodesqlv8');



function callDB(dataserver, DataBase, query) {
  var config = {
    driver: 'msnodesqlv8',
    server: dataserver,
    database: DataBase,
    options: { trustedConnection: true, useUTC: true }
  };

  return sql.connect(config, function (err) {
    if(err) { console.log(err); }
    var request = new sql.Request();
    return request.query(query, function(err, records) {
      if(err) {
        console.log(err);
      } else {
        console.log(records);
        return records;
      }
    });
  });
}


function datepart(lowmonth, highmonth, lowyear, highyear) {
 return " datepart(mm, datetime) between " + lowmonth + " and " + highmonth +
  "and datepart(yy, datetime) between " + lowyear + " and " + highyear + " ";
}


function calenderQuery(server, database, table, lowmonth, highmonth, lowyear, highyear) {
  var query = "select cast(datetime as date) as datetime, avg(occupancy) as " +
    "occupancy from " + table + " where " +
    datepart(lowmonth, highmonth, lowyear, highyear) + " group by cast(datetime as date)";
  const response = callDB(server, database, query);
  return waitUntilComplete(response);
}



function barChartQuery(server, database, table, lowmonth, highmonth, lowyear, highyear, Llane, Hlane) {
  var query = "select vdsId, correctVolume+correctSpeed+correctOccupancy correct, ";
  query += " incorrectVolume+incorrectSpeed+incorrectOccupancy incorrect from ( select vdsId, ";
  query += "sum(case when volume >= 0 then 1 else 0 end) correctVolume, ";
  query += "sum(case when volume < 0 then 1 else 0 end) incorrectVolume, ";
  query += "sum(case when speed >= 0 then 1 else 0 end) correctSpeed, ";
  query += "sum(case when speed < 0 then 1 else 0 end) incorrectSpeed, ";
  query += "sum(case when occupancy >= 0 then 1 else 0 end) correctOccupancy, ";
  query += "sum(case when occupancy < 0 then 1 else 0 end) incorrectOccupancy ";
  query += " from " + table + " where vdsId is not null ";
  query += " and " + datepart(lowmonth, highmonth, lowyear, highyear);
  query += " and lane between " + Llane + " and " + Hlane + " group by vdsId) as a";
  const response = callDB(server, database, query);
  return waitUntilComplete(response);
}


function hexbinQuery(server, database, table, lowmonth, highmonth, lowyear, highyear, day) {
  var query = "select datetime, speed from " + table +
   " where datepart(dd, datetime) = " + day + " and ";
  query += datepart(lowmonth, highmonth, lowyear, highyear);
  const response = callDB(server, database, query);
  return waitUntilComplete(response);
}


function scatterPlotQuery(server, database, table, lowmonth, highmonth, lowyear, highyear, day) {
  var query = "select datetime, speed from " + table + " where ";
  query += datepart(lowmonth, highmonth, lowyear, highyear);
  query += " and datepart(dd, datetime) = " + day;
  const response = callDB(server, database, query);
  return waitUntilComplete(response);
}

// Former known as doughnutQuery
function completenessQuery(server, database, table, lowmonth, highmonth, lowyear, highyear, lowday, highday) {
  var query = "select count(distinct tble.recordId) as records, ";
   query += " Combo.dy, Combo.mth, Combo.yr, Combo.vdsId from " + table + " as tble,";
   query += " (select V.vdsId, D.dy, D.mth, D.yr from (select distinct vdsId from " + table + " ) as V,";
   query += "(select distinct datepart(dd, datetime) as dy, datepart(mm, datetime) as mth,";
   query += " datepart(yyyy, datetime) as yr from " + table + ")   as D ) as Combo ";
   query += " where tble.vdsId = Combo.vdsId and datepart(dd, datetime) = Combo.dy";
   query += " and Combo.dy between " + lowday + " and " + highday;
   query += " and Combo.mth between " + lowmonth + " and " + highmonth;
   query += " and Combo.yr between " + lowyear + " and " + highyear;
   query += " group by Combo.dy, Combo.mth, Combo.yr, Combo.vdsId order by Combo.vdsId";
  const response = callDB(server, database, query);
  return waitUntilComplete(response);
}

function waitUntilComplete(response) {
  // removed, attempted to use promises here.

  return response
}


function test() {
  var response;
  var server = 'DESKTOP-TOSQMFB';
  var database = 'CMPT498';
  var table = '[both raw]';
  var lowmonth = '1';
  var highmonth = '12';
  var lowyear = '2016';
  var highyear = '2017';
  try {
    //response = calenderQuery(server, database, table, '1', '12', lowyear, highyear);
    //response = barChartQuery(server, database, table,'1', '12', lowyear, highyear, '1', '4');
    //response = hexbinQuery(server, database, table, lowmonth, highmonth, '2017', highyear, '1');
    //response = scatterPlotQuery(server, database, table, lowmonth, highmonth, lowyear, highyear, '1');
    response = completenessQuery(server, database, table, lowmonth, highmonth, lowyear, highyear, '1','27');
    console.log("Done");
  } catch(err) {
    console.log("ERROR: Did not reach DataBase.");
  }

}

test();
