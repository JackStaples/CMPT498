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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace ETLtool
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public ETLController Controller;

        public MainWindow()
        {        
            InitializeComponent();//           server         database
            Controller = new ETLController("rawdata", "DESKTOP-L3U7II0", "CMPT498");
            this.ResizeMode = System.Windows.ResizeMode.NoResize;
        }

        private void Warehouse_Click(object sender, RoutedEventArgs e)
        {
            Warehouse table = new Warehouse(Controller, this);
            table.Show();
            this.Hide();
        }

        private void Locations_Click(object sender, RoutedEventArgs e)
        {
            
            locationTable table = new locationTable(Controller, this);
            table.Show();
            this.Hide();
        }
    }
}
