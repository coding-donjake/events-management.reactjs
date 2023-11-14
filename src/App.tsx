import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// index
import IndexScreen from "./screens/IndexScreen";

// dashboard
import DashboardIndexScreen from "./screens/dashboard/IndexScreen";

// users
import UsersIndexScreen from "./screens/users/IndexScreen";
import UsersCreateScreen from "./screens/users/CreateScreen";
import UsersUpdateScreen from "./screens/users/UpdateScreen";
import UsersViewScreen from "./screens/users/ViewScreen";
import UsersLogsScreen from "./screens/users/LogsScreen";

// customers
import CustomersIndexScreen from "./screens/customers/IndexScreen";
import CustomersCreateScreen from "./screens/customers/CreateScreen";
import CustomersUpdateScreen from "./screens/customers/UpdateScreen";
import CustomersViewScreen from "./screens/customers/ViewScreen";
import CustomersLogsScreen from "./screens/customers/LogsScreen";

// orders
import OrdersCreateScreen from "./screens/orders/CreateScreen";
import OrdersUpdateScreen from "./screens/orders/UpdateScreen";
import OrdersViewScreen from "./screens/orders/ViewScreen";
import OrdersLogsScreen from "./screens/orders/LogsScreen";

// suppliers
import SuppliersCreateScreen from "./screens/suppliers/CreateScreen";
import SuppliersUpdateScreen from "./screens/suppliers/UpdateScreen";
import SuppliersViewScreen from "./screens/suppliers/ViewScreen";
import SuppliersLogsScreen from "./screens/suppliers/LogsScreen";

// supplies
import SuppliesIndexScreen from "./screens/supplies/IndexScreen";
import SuppliesCreateScreen from "./screens/supplies/CreateScreen";
import SuppliesUpdateScreen from "./screens/supplies/UpdateScreen";
import SuppliesViewScreen from "./screens/supplies/ViewScreen";
import SuppliesLogsScreen from "./screens/supplies/LogsScreen";

// events
import EventsIndexScreen from "./screens/events/IndexScreen";
import EventsCreateScreen from "./screens/events/CreateScreen";
import EventsUpdateScreen from "./screens/events/UpdateScreen";
import EventsViewScreen from "./screens/events/ViewScreen";
import EventsLogsScreen from "./screens/events/LogsScreen";

// event-supplies
import EventSuppliesUpdateScreen from "./screens/event-supplies/UpdateScreen";
import EventPaymentCreateScreen from "./screens/event-payments/CreateScreen";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Outlet />}>
        {/* index */}
        <Route index element={<IndexScreen />} />
        {/* dashboard */}
        <Route path="/dashboard" element={<DashboardIndexScreen />} />
        {/* users */}
        <Route path="/users" element={<UsersIndexScreen />} />
        <Route path="/users/create" element={<UsersCreateScreen />} />
        <Route path="/users/update/:id" element={<UsersUpdateScreen />} />
        <Route path="/users/view/:id" element={<UsersViewScreen />} />
        <Route path="/users/view/:id/logs" element={<UsersLogsScreen />} />
        {/* customers */}
        <Route path="/customers" element={<CustomersIndexScreen />} />
        <Route path="/customers/create" element={<CustomersCreateScreen />} />
        <Route
          path="/customers/update/:id"
          element={<CustomersUpdateScreen />}
        />
        <Route path="/customers/view/:id" element={<CustomersViewScreen />} />
        <Route
          path="/customers/view/:id/logs"
          element={<CustomersLogsScreen />}
        />
        {/* supplies */}
        <Route path="/supplies" element={<SuppliesIndexScreen />} />
        <Route path="/supplies/create" element={<SuppliesCreateScreen />} />
        <Route path="/supplies/update/:id" element={<SuppliesUpdateScreen />} />
        <Route path="/supplies/view/:id" element={<SuppliesViewScreen />} />
        <Route
          path="/supplies/view/:id/logs"
          element={<SuppliesLogsScreen />}
        />
        {/* supplier */}
        <Route
          path="/supplies/supplier/create"
          element={<SuppliersCreateScreen />}
        />
        <Route
          path="/supplies/supplier/update/:id"
          element={<SuppliersUpdateScreen />}
        />
        <Route
          path="/supplies/supplier/view/:id"
          element={<SuppliersViewScreen />}
        />
        <Route
          path="/supplies/supplier/view/:id/logs"
          element={<SuppliersLogsScreen />}
        />
        {/* order */}
        <Route path="/supplies/order/create" element={<OrdersCreateScreen />} />
        <Route
          path="/supplies/order/update/:id"
          element={<OrdersUpdateScreen />}
        />
        <Route path="/supplies/order/view/:id" element={<OrdersViewScreen />} />
        <Route
          path="/supplies/order/view/:id/logs"
          element={<OrdersLogsScreen />}
        />
        {/* events */}
        <Route path="/events" element={<EventsIndexScreen />} />
        <Route path="/events/create" element={<EventsCreateScreen />} />
        <Route path="/events/update/:id" element={<EventsUpdateScreen />} />
        <Route path="/events/view/:id" element={<EventsViewScreen />} />
        <Route path="/events/view/:id/logs" element={<EventsLogsScreen />} />
        {/* event-supplies */}
        <Route
          path="/events/view/:id/event-supplies"
          element={<EventSuppliesUpdateScreen />}
        />
        <Route
          path="/events/view/:id/add-payment"
          element={<EventPaymentCreateScreen />}
        />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};

export default App;
