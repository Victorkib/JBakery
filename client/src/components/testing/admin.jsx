import { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import moment from 'moment';
import GitHubCalendar from 'react-github-calendar';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DraggableBox = ({ id, children }) => {
  const [, ref] = useDrag({
    type: 'BOX',
    item: { id },
  });
  return (
    <Box ref={ref} border="1px solid gray" p={2} width={300}>
      {children}
    </Box>
  );
};

const DroppableArea = ({ onDrop }) => {
  const [, ref] = useDrop({
    accept: 'BOX',
    drop: (item) => onDrop(item.id),
  });
  return <Box ref={ref} border="1px solid gray" p={2} width={300} />;
};

const Admin = () => {
  const [salesData, setSalesData] = useState({ labels: [], datasets: [] });
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [inventory, setInventory] = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Fetch data on component mount
  //   useEffect(() => {
  //     Promise.all([
  //       fetchSalesData(),
  //       fetchOrders(),
  //       fetchInventory(),
  //       fetchCustomers(),
  //       fetchStaff(),
  //     ]).catch((error) => console.error('Error fetching data:', error));
  //   }, []);

  const dummyOrders = [
    { id: 1, customerName: 'John Doe', status: 'pending' },
    { id: 2, customerName: 'Jane Smith', status: 'in-progress' },
    { id: 3, customerName: 'Michael Brown', status: 'completed' },
    { id: 4, customerName: 'Emily White', status: 'canceled' },
  ];

  const dummyInventory = [
    { id: 1, name: 'Flour', quantity: 20, threshold: 10 },
    { id: 2, name: 'Sugar', quantity: 5, threshold: 10 },
    { id: 3, name: 'Eggs', quantity: 50, threshold: 20 },
    { id: 4, name: 'Butter', quantity: 2, threshold: 5 },
  ];

  const dummyCustomers = [
    { id: 1, name: 'John Doe', orders: 3, loyaltyPoints: 150 },
    { id: 2, name: 'Jane Smith', orders: 5, loyaltyPoints: 300 },
    { id: 3, name: 'Michael Brown', orders: 1, loyaltyPoints: 50 },
    { id: 4, name: 'Emily White', orders: 2, loyaltyPoints: 100 },
  ];

  const dummyStaff = [
    { id: 1, name: 'Alice Johnson', role: 'Baker', shift: 'Morning' },
    { id: 2, name: 'Bob Williams', role: 'Sales', shift: 'Evening' },
    { id: 3, name: 'Charlie Davis', role: 'Delivery', shift: 'Afternoon' },
    { id: 4, name: 'Diana Martinez', role: 'Admin', shift: 'Flexible' },
  ];

  // Use dummy data instead of API calls for now
  useEffect(() => {
    setOrders(dummyOrders);
    setFilteredOrders(dummyOrders);
    setInventory(dummyInventory);
    setLowStockAlerts(
      dummyInventory.filter((item) => item.quantity < item.threshold)
    );
    setCustomers(dummyCustomers);
    setStaff(dummyStaff);
  }, []);

  // Fetch sales data for dashboard chart
  const fetchSalesData = async () => {
    const response = await axios.get('/api/sales');
    const labels = response.data.map((item) => item.date);
    const dataset = {
      label: 'Revenue ($)',
      data: response.data.map((item) => item.amount),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    };
    setSalesData({ labels, datasets: [dataset] });
  };

  // Fetch orders and filter them based on status
  const fetchOrders = async () => {
    const response = await axios.get('/api/orders');
    setOrders(response.data);
    setFilteredOrders(filterOrdersByStatus(response.data, statusFilter));
  };

  const filterOrdersByStatus = (orders, status) => {
    if (status === 'all') return orders;
    return orders.filter(
      (order) => order.status.toLowerCase() === status.toLowerCase()
    );
  };

  // Fetch inventory and identify low-stock items
  const fetchInventory = async () => {
    const response = await axios.get('/api/inventory');
    setInventory(response.data);
    const lowStock = response.data.filter(
      (item) => item.quantity < item.threshold
    );
    setLowStockAlerts(lowStock);
  };

  // Fetch customer data
  const fetchCustomers = async () => {
    const response = await axios.get('/api/customers');
    setCustomers(response.data);
  };

  // Fetch staff data
  const fetchStaff = async () => {
    const response = await axios.get('/api/staff');
    setStaff(response.data);
  };

  // Handle order status update
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}`, { status: newStatus });
      setSnackbarMessage(`Order #${orderId} updated to ${newStatus}`);
      setSnackbarOpen(true);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Close snackbar
  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleDrop = (id) => {
    console.log(`Dropped item with id: ${id}`);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        {/* Dashboard */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Dashboard
              </Typography>
              <Bar
                data={salesData}
                options={{ responsive: true, maintainAspectRatio: false }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Orders Management */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Orders Management
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <TextField
                  label="Filter by Status"
                  select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setFilteredOrders(
                      filterOrdersByStatus(orders, e.target.value)
                    );
                  }}
                >
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </TextField>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.customerName}</TableCell>
                        <TableCell>{order.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() =>
                              handleOrderStatusUpdate(order.id, 'completed')
                            }
                          >
                            Mark as Completed
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Alerts */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Inventory Alerts
              </Typography>
              {lowStockAlerts.length > 0 ? (
                <ul>
                  {lowStockAlerts.map((item) => (
                    <li key={item.id}>
                      {item.name} - Quantity: {item.quantity}
                    </li>
                  ))}
                </ul>
              ) : (
                <Alert severity="info">No low-stock alerts.</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Customer Feedback Heatmap */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Customer Feedback Heatmap
              </Typography>
              <GitHubCalendar
                values={[
                  { date: moment().subtract(1, 'days').toDate(), count: 5 },
                  { date: moment().toDate(), count: 10 },
                ]}
                endDate={moment().toDate()}
                startDate={moment().subtract(30, 'days').toDate()}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Staff Scheduling */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Staff Scheduling
              </Typography>
              <DroppableArea onDrop={handleDrop}>
                <DraggableBox id="1">
                  Drag and drop to rearrange shifts.
                </DraggableBox>
              </DroppableArea>
            </CardContent>
          </Card>
        </Grid>

        {/* Snackbar for Notifications */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={closeSnackbar}
        >
          <Alert onClose={closeSnackbar} severity="success">
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </DndProvider>
  );
};

export default Admin;
