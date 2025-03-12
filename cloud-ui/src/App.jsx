import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clusters from "./pages/Clusters";
import Users from "./pages/Users";
import ScalingHistory from "./components/ScalingHistory";
import PrivateRoute from "./components/PrivateRoute";
import Settings from "./pages/Settings";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clusters" element={<Clusters />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/scaling-history" element={<ScalingHistory />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
