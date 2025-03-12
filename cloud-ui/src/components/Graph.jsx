import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/Dashboard.css";

function Graph({ title, dataKey, data }) {
  return (
    <div className="graph-container">
      <h3>{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="white" />
          <YAxis stroke="white" />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#00bcd4" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;
