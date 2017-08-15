using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using System.Windows.Forms;
using Microsoft.Win32;
using System.Data;

namespace ETLtool
{
    /// <summary>
    /// Interaction logic for locationTable.xaml
    /// </summary>
    public partial class locationTable : Window
    {
        public ETLController Controller;
        public MainWindow mainWin;

        public locationTable(ETLController mainController, MainWindow main)
        {
            InitializeComponent();
            Controller = mainController;
            mainWin = main;
            this.ResizeMode = System.Windows.ResizeMode.NoResize;
            this.Closed += new EventHandler(location_Closed);
        }

        void location_Closed(object sender, EventArgs e)
        {
            mainWin.Show();
        }


        private void Showlocations(object sender, RoutedEventArgs e)
        {
            if(!Controller.checkForLocationTable())
            {
                System.Windows.MessageBox.Show("No locations. Add locations from file, as csv: lat, long, location, spdLimit, vdsId");
                Controller.createlocationTable();
            }
            DataTable table = Controller.getLocations(new DataTable());
            locationDataGrid.ItemsSource = table.DefaultView;


        }

        private void AddLocations_Click(object sender, RoutedEventArgs e)
        {
            
            System.Windows.Forms.OpenFileDialog findFile = new System.Windows.Forms.OpenFileDialog();
            findFile.Multiselect = false;
            findFile.Filter = "A (*.csv) | *.csv|B (*.txt) | *.txt | AllFiles (*.*) |*.*";
            findFile.DefaultExt = ".csv";
            System.Windows.Forms.DialogResult result =  findFile.ShowDialog();
            if(result == System.Windows.Forms.DialogResult.OK)
            {
                string fileLocation = @findFile.FileName;
                
                MessageBoxResult answer = System.Windows.MessageBox.Show("You selected " +
                    fileLocation + ", Do you want to add this data to location table?", 
                    "Confirmation", MessageBoxButton.YesNo, MessageBoxImage.Question);
                if (answer == MessageBoxResult.Yes)
                {
                    AttemptSendToDB(fileLocation);
                }
            }
        }


        private void AttemptSendToDB(string fileLocation)
        {
            if (!Controller.checkForLocationTable())
            {
                Controller.createlocationTable();
            }
            try
            {
                if(Controller.populatelocationTable(fileLocation))
                {
                    System.Windows.MessageBox.Show("Text Import successful.");
                } else
                {
                    System.Windows.MessageBox.Show("Text import unsuccessful. " +
                        "Invalid format, or data already present.");
                }
            } catch
            {
                System.Windows.MessageBox.Show("A error occured, incomplete import. Try again?");
            }

        }


    }






}
