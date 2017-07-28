using System;
using System.Collections;
using System.Data.SqlClient;

namespace Seeder
{
    class Program
    {
        static private SqlConnection Connector;
        static private SqlCommand Command;
        static private SqlDataReader Reader;
        static private string database = "CMPT498";
        static private string table = "[both raw]";
        static private string temp = "fauxWareHouse";// or daytable
        static private string connect = "server=DESKTOP-TOSQMFB; database=" + database + "; trusted_connection=True;";
        static private int[] startDate = { 2017, 01, 01, 00, 00, 00};
        static private int iterations = 35041;//Number of 15min intervals in a year.
        static private int time = 15;//minutes
        static private int seconds = 0;// adjust for "raw" table.
        static private int[] vdsIds;
        static private int[] Lanes;
        static private int[] avgSpeed;
        static private string rows;
        static private ArrayList General;
        static private string datecheck;

        static void setup()
        {
            Connector = new SqlConnection();
            Command = new SqlCommand();
            Connector.ConnectionString = connect;
            Command.Connection = Connector;
            vdsIds = new int[110];
            Lanes = new int[110];
            avgSpeed = new int[110];
            General = new ArrayList();
        }


        static void Main(string[] args)
        {
            setup();
            populateDetectorArray();
            createfauxWarehouse();
            launchLoader();
            System.Console.WriteLine("Press Enter To exit.");
            System.Console.Read();
        }


        static private void populateDetectorArray()
        {
            System.Console.WriteLine("Gathering vdsId, speed, and lane info...");
            string query = "select distinct vdsId, lane, avg(abs(speed) + " +
                " (case when abs(speed) = 0 then 0 else 30 end)) from " + table +
                " where vdsId is not null group by vdsId, lane order by vdsId, lane";
            GeneralQuery(query, true);
            int i = 0;
            string[] sep = { "," };
            string[] tokens = new string[3];
            foreach (string pair in General)
            {
                tokens = pair.Split(sep, StringSplitOptions.None);
                vdsIds[i] = Convert.ToInt32(tokens[0]);
                Lanes[i] = Convert.ToInt32(tokens[1]);
                avgSpeed[i] = Convert.ToInt32(tokens[2]);
                i++;
            }
            System.Console.WriteLine("Done.");
        }


        static void createfauxWarehouse()
        {
            System.Console.WriteLine("Creating '" + temp + "' table with clustered index...");
            string query = "create table " + temp + " ( dt datetime NOT NULL, vdsId int NOT NULL, " +
                            "lane int NOT NULL, rawSpeed int, speed int, " +
                           "rawOcc int, occ int, vol int, correct int, incorrect int, total int " +
                           " PRIMARY KEY CLUSTERED (dt, vdsId, lane) );";
            GeneralQuery(query, false);

        }


        static void GeneralQuery(string query, bool get)
        {
            General.Clear();
            Command.CommandText = query;
            Connector.Open();
            if (get)
            {
                getData();
            }
            else
            {
                sendData();
            }
            Connector.Close();
        }


        static void getData()
        {

            try
            {
                Reader = Command.ExecuteReader();
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
            catch
            {
                System.Console.WriteLine("No result");
                Environment.Exit(0);
            }
        }


        static void sendData()
        {
            try
            {
                Command.ExecuteNonQuery();
            }
            catch
            {

                System.Console.WriteLine("Something went wrong at " + datecheck);
                wait();
            }
        }
        static private void wait()
        {
            System.Console.WriteLine("Press Enter To exit.");
            System.Console.Read();
            Environment.Exit(0);
        }

        static private void launchLoader()
        {
            System.Console.WriteLine("Beginning Insertion...");
            Random rnd = new Random();
            for (int i = 0; i < iterations; i++)
            {
                makeRows(rnd);
                GeneralQuery(rows, false);
                if((i != 0) && (i % 96 == 0))
                {
                    System.Console.WriteLine("Inserted another day, or " + 
                    Convert.ToString(i * 110) + " batches into database...");
                }
            }
        }


        static private void makeRows(Random rnd)
        {
            rows =  "insert into " + temp + " (dt, vdsId, lane, rawSpeed, speed, " + 
                "rawOcc, occ, vol, correct, incorrect, total) values ";
            string dt = makeDate();
            datecheck = dt;
            int correct;
            int incorrect;
            for(int i = 0; i < Lanes.Length; i++)
            {
                correct = 135;
                incorrect = Convert.ToInt32(randNum(rnd, 0, 80, 0, true, 50));
                correct = correct - incorrect;
                rows += " ( '" + dt + "', " + Convert.ToString(vdsIds[i]) + ", " + Convert.ToString(Lanes[i]) +
                    ", " + randNum(rnd, 0, 80, 10, false, 86) + ", " + randNum(rnd, avgSpeed[i], 10, 18, true, 75) + 
                    ", " + randNum(rnd, 0, 100, 3, false, 30) + ", " + randNum(rnd, 0, 100, 0, true, 30) +
                    ", " + randNum(rnd, 0, 3500, 0, true, 15) + ", " + Convert.ToString(correct) + ", " + 
                    Convert.ToString(incorrect) + ", 45),";
            }

            rows =  rows.TrimEnd(rows[rows.Length - 1]);

        }


        static private string makeDate()
        {
            // startDate = { 2017, 01, 01, 00, 00, 00 }           
            string[] sep = { "-", "-", " ", ":", ":", "" };
            string dt = "";

            int i = 0;
            foreach (int num in startDate)
            {
                
                dt += dayMonth(num, i) + sep[i];
                i++;
            }
            incDate();
            return dt;
        }


        static private string dayMonth(int num, int i)
        {
            if((i != 0) && (num < 10))
            {
                return "0" + Convert.ToString(num);
            } else
            {
                return Convert.ToString(num);
            }
        }


        static private void incDate()
        {
            int maxMonth = getMaxMonth();
            startDate[startDate.Length - 1] += seconds;           
            if (startDate[startDate.Length - 1] == 60)
            {
                startDate[startDate.Length - 1] = 0;
                startDate[startDate.Length - 2]++;
            }
            startDate[startDate.Length - 2] += time;
            if (startDate[startDate.Length - 2] >= 60)
            {
                startDate[startDate.Length - 2] %= 60;
                startDate[startDate.Length - 3]++;
            }
            if (startDate[startDate.Length - 3] == 24)
            {
                startDate[startDate.Length - 3] = 0;
                startDate[startDate.Length - 4]++;
            }
            if(startDate[startDate.Length - 4] > maxMonth)
            {
                startDate[startDate.Length - 4] = 1;
                startDate[startDate.Length - 5]++;
            }
            if(startDate[startDate.Length - 5] > 12)
            {
                startDate[startDate.Length - 5] = 1;
                startDate[startDate.Length - 6]++;
            }
            
        }


        static private int getMaxMonth()
        {
            int month = startDate[startDate.Length - 5];
            int maxMonth;
            switch(month)
            {
                case 2:
                    maxMonth = 28;
                    break;
                case 4:
                case 6:
                case 9:
                case 11:
                    maxMonth = 30;
                    break;
                default:
                    maxMonth = 31;
                    break;
            }
            return maxMonth;
        }

        static private string randNum(Random rnd, int input, 
            int range, int bias, bool positive, int chanceof0)
        {
                   
            int half = range / 2;
            int rand = rnd.Next((-1 * half), half + 1);
            half = half / 2;
            rand += rnd.Next((-1 * half), half +1);
            rand += rnd.Next((-1 * half), half + 1);
            rand = rand / 3;
            input = input + rand + bias;
            if(positive)
            {
                input = System.Math.Abs(input);
            }
            if(rnd.Next(0,101) <= chanceof0)
            {
                input = 0;
            }
            return Convert.ToString(input);
        }

        static private string alterSpeed(int speed)
        {
            return Convert.ToString(speed);
        }

        static private string alterTotal()
        {
            return Convert.ToString(5);
        }
    }
}
