using System;
using System.Data.SqlClient;
using System.Collections;
using System.Data;

namespace ETLtool
{
    public class ETLController
    {
        static private SqlConnection Connector;
        static private SqlCommand Command;
        static private SqlDataReader Reader;

        static private string[] datetimes;
        static private ArrayList General;

        static private string connect;
        static private string table;
        static private int timespan = 5;
        static private bool loadtable = false;
        static private DataTable loader;
        


        public ETLController(string tableName, string server, string database)
        {
            table = tableName;
            connect = connect = "server=" + server + "; database=" + database + "; trusted_connection=True;";
            General = new ArrayList();
            Connector = new SqlConnection();
            Command = new SqlCommand();
            Connector.ConnectionString = connect;
            Command.Connection = Connector;
        }

        public string getTable()
        {
            return table;
        }

        void GeneralQuery(string query, bool get)
        {
            Connector.Close();
            Command.CommandTimeout = 60;
            Command.CommandText = query;
            Connector.Open();
            if (get)
            {
                getData();
            }
            else
            {
                Command.ExecuteNonQuery();
            }
            Connector.Close();

        }

        private void getData()
        {
            General.Clear();
            Reader = Command.ExecuteReader();
            if(loadtable)
            {
                loader.Load(Reader);
                return;
            }
            while (Reader.Read())
            {
                string row = "";
                for (int i = 0; i < Reader.FieldCount; i++)
                {
                    row += Reader[i].ToString();
                    if (i < Reader.FieldCount - 1)
                    {
                        row += ",";
                    }
                }
                General.Add(row);
            }
        }

        public DataTable checkForRawTables(DataTable tble)
        {
            string query = "select TABLE_NAME from INFORMATION_SCHEMA.COLUMNS where " +
                            "COLUMN_NAME = 'vdsId' and TABLE_NAME != 'VDSIDs' and TABLE_NAME != 'Warehouse' ;";
            loader = tble;
            loadtable = true;
            GeneralQuery(query, true);
            loadtable = false;
            return tble = loader;
        }

        public bool checkForLocationTable()
        {
            GeneralQuery("SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'VDSIDs'", true);
            string[] item = new string[General.Count];
            General.CopyTo(item);
            return Convert.ToInt32(item[0]) == 1;
        }

        public void createlocationTable()
        {
            string query = "create table VDSIDs ( lat float(10), long float(10), location varchar(50), " +
                "spdLimit int, vdsId int ) ";
            GeneralQuery(query, false);
        }

        public bool checkForWarhouse()
        {
            GeneralQuery("SELECT count(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Warehouse'", true);
            string[] item = new string[General.Count];
            General.CopyTo(item);
            return Convert.ToInt32(item[0]) == 1;
        }

        public void createWarehouseTable()
        {
            //System.Console.WriteLine("Creating 'Warehouse' table with clustered index...");
            string query = "create table Warehouse ( dt datetime NOT NULL, vdsId int NOT NULL, " +
                            "lane int NOT NULL, speed int, " +
                           " occ int, vol int, correct int, incorrect int, total int " +
                           " PRIMARY KEY CLUSTERED (dt, vdsId, lane) );";
            GeneralQuery(query, false);

        }

        public bool populatelocationTable(string fileLocation)
        {

            string[] lines = System.IO.File.ReadAllLines(fileLocation);

            string query = "";
            string[] splitted;
            char[] param = { ',' };
            foreach (string line in lines)
            {
                splitted = line.Split(param, StringSplitOptions.None);
                if(badFile(splitted)) { return false;  }
                if(checkDuplicates(splitted[4]))
                {
                    query += "( " + splitted[0] + ", " + splitted[1] + ", '" + splitted[2] +
                                        "', " + splitted[3] + ", " + splitted[4] + " ), ";
                }               
            }
            char[] param2 = { ',', ' ' };
            query = query.TrimEnd(param2);
            if(query == "") { return false;  }
            query = "insert into VDSIDs (lat, long,  location, spdLimit, vdsId) values " + query;
            GeneralQuery(query, false);
            return true;
        }

        private bool checkDuplicates(string vdsId)
        {
            string query = "select count(*) from VDSIDs where vdsId = " + vdsId + " ;";
            GeneralQuery(query, true);
            string[] item = new string[General.Count];
            General.CopyTo(item);
            return Convert.ToInt32(item[0]) == 0;
        }

        public DataTable getLocations(DataTable tble)
        {
            string query = "select lat, long,  location, spdLimit, vdsId from VDSIDs";
            loader = tble;
            loadtable = true;
            GeneralQuery(query, true);
            loadtable = false;
            return tble = loader;
        }

        private bool badFile(string[] line)
        {
            decimal a = 0;
            int b = 0;
            return !((line.Length == 5) &&
                (decimal.TryParse(line[0], out a)) &&
                (decimal.TryParse(line[1], out a)) &&
                (int.TryParse(line[3], out b)) &&
                (int.TryParse(line[4], out b)));
        }


        public int getTimeSpan(string low, string high)
        {
            string query = "select distinct datetime from " + table +
                                  " where datepart(mi, datetime) % " + Convert.ToString(timespan) + " = 0 " +
                                  "and datetime >= '" + dateFormat(low) +
                                  "' and datetime <= '" + dateFormat(high) +
                                  "' and datepart(ss, datetime) = 0 order by datetime;";
            GeneralQuery(query, true);
            datetimes = new string[General.Count];
            General.CopyTo(datetimes);
            return datetimes.Length;
        }

        public void transfer(int i)
        {
            string query = "exec DataBaseTransfer  @StartDate = '" + dateFormat(datetimes[i - 1]) +
                    "', @EndDate = '" + dateFormat(datetimes[i]) + "' ;";
            GeneralQuery(query, false);
        }


        string dateFormat(string time)
        {
            string date;

            string[] sep = { " ", "-", ":", "." };
            string[] splitted = time.Split(sep, StringSplitOptions.None);
            int hour = Convert.ToInt32(splitted[3]);
            if (splitted[6] == "PM" && hour != 12)
            {
                hour = hour + 12;
            }
            else if (splitted[6] == "AM" && hour == 12)
            {
                hour = 0;
            }
            string sHour = Convert.ToString(hour);
            if (hour < 10)
            {
                
                sHour = "0" + sHour;
            } 
            
            date = splitted[0] + "-" + splitted[1] +
                "-" + splitted[2] + " " + sHour +
                ":" + splitted[4] + ":" +
                splitted[5] + ".00";
            return date;
        }

        public void erase()
        {
            Connector.Close();
            GeneralQuery("truncate table Warehouse;", false);
        }
    }
}
