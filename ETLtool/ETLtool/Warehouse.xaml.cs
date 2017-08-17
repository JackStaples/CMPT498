using System;
using System.Windows;
using System.Windows.Input;
using System.Data;


namespace ETLtool
{

    public partial class Warehouse : Window
    {
        public ETLController Controller;
        public MainWindow mainWin;

        private System.ComponentModel.BackgroundWorker worker;
        private int size;

        public Warehouse(ETLController mainController, MainWindow main)
        {
            InitializeComponent();
            mainWin = main;
            Controller = mainController;
            this.ResizeMode = System.Windows.ResizeMode.NoResize;
            this.Closed += new EventHandler(Warehouse_Closed);
            worker = new System.ComponentModel.BackgroundWorker();
            worker.WorkerReportsProgress = true;
            worker.DoWork += new System.ComponentModel.DoWorkEventHandler(execute);
            worker.ProgressChanged += new System.ComponentModel.ProgressChangedEventHandler(updateProgress);
            worker.RunWorkerCompleted += new System.ComponentModel.RunWorkerCompletedEventHandler(reset);
            worker.WorkerSupportsCancellation = true;
            Progress.Visibility = System.Windows.Visibility.Hidden;
            status.Visibility = System.Windows.Visibility.Hidden;
        }

        void Warehouse_Closed(object sender, EventArgs e)
        {          
            if (worker.IsBusy)
            {
                worker.CancelAsync();
            }
            Controller.erase();
            mainWin.Show();

        }


        private void hideDates()
        {
            LowDate.Visibility = System.Windows.Visibility.Hidden;
            HighDate.Visibility = System.Windows.Visibility.Hidden;
            Ok.IsEnabled = false;
            Progress.Visibility = System.Windows.Visibility.Visible;
            status.Visibility = System.Windows.Visibility.Visible;
            PickDate.Visibility = System.Windows.Visibility.Hidden;
            To.Visibility = System.Windows.Visibility.Hidden;
            From.Visibility = System.Windows.Visibility.Hidden;
            Cancel.IsEnabled = true;
        }

        private void showDates()
        {
            LowDate.Visibility = System.Windows.Visibility.Visible;
            HighDate.Visibility = System.Windows.Visibility.Visible;
            Ok.IsEnabled = true;
            Progress.Visibility = System.Windows.Visibility.Hidden;
            status.Visibility = System.Windows.Visibility.Hidden;
            PickDate.Visibility = System.Windows.Visibility.Visible;
            To.Visibility = System.Windows.Visibility.Visible;
            From.Visibility = System.Windows.Visibility.Visible;
            Cancel.IsEnabled = false;
        }

        private void Ok_Click(object sender, RoutedEventArgs e)
        {
            if(HighDate.SelectedDate == null || LowDate.SelectedDate == null)
            {
                MessageBox.Show("You must select a high and low date.");
                return;
            } else if(HighDate.SelectedDate < LowDate.SelectedDate)
            {
                MessageBox.Show("End date must be after start date.");
                return;
            } else if(HighDate.SelectedDate > DateTime.Now.Date)
            {
                MessageBox.Show("End date cannot be in the future.");
                return;
            }
            if (!Controller.checkForWarhouse())
            {
                Controller.createWarehouseTable();
            }
            hideDates();
            size = Controller.getTimeSpan(
                LowDate.SelectedDate.ToString(),
                HighDate.SelectedDate.ToString()
                );
            worker.RunWorkerAsync();
        }

        private void execute(object sender, System.ComponentModel.DoWorkEventArgs e)
        {
            Controller.erase();
            double temp = 0.0;
            double floatsize = Convert.ToDouble(size);
            for (int i = 1; i < size; i++)
            {
                if (worker.CancellationPending)
                {
                    e.Cancel = true;
                    return;
                } else
                {
                    Controller.transfer(i);
                    temp = Convert.ToDouble(i) / floatsize * 100.0;
                    worker.ReportProgress(Convert.ToInt32(temp));
                }

            }  
        }

        private void updateProgress(object sender, System.ComponentModel.ProgressChangedEventArgs e)
        {
            Progress.Value = e.ProgressPercentage;
            status.Content = "Inserting... " + Convert.ToString(e.ProgressPercentage) + "% complete";

        }

        private void reset(object sender, System.ComponentModel.RunWorkerCompletedEventArgs e)
        {
            showDates();
        }

        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            worker.CancelAsync();
            Controller.erase();
            //showDates();
        }
    }
}
