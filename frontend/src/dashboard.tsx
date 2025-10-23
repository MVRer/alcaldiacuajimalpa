import * as React from "react";
import { useGetList, usePermissions } from "react-admin";
import { Navigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const reportWayChoices = [
  { id: "C5", name: "C5" },
  { id: "C3", name: "C3" },
  { id: "Policia", name: "Policia" },
  { id: "Directo", name: "Directo" },
  { id: "otro", name: "Otro" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const Dashboard = () => {
  const { permissions } = usePermissions();

  if (!permissions?.includes('*')) {
    return <Navigate to="/#" replace />;
  }

  const { data: reports, isLoading } = useGetList("reports", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "DESC" },
  });


  const { data: users, isLoading: usersLoading } = useGetList("users", {
    pagination: { page: 1, perPage: 1000 },
  });


  const { data: turnReports, isLoading: turnReportsLoading } = useGetList("turn-reports", {
    pagination: { page: 1, perPage: 1000 },
  });

  if (isLoading) return <p>Cargando...</p>;
  if (!reports) return <p>No hay reportes</p>;

  const total = reports.length;
  const totalUsers = users?.length || 0;

  const avgTraslado =
    reports.reduce((sum, r) => sum + (r.tiempo_translado || 0), 0) / total || 0;
  const avgKm =
    reports.reduce((sum, r) => sum + (r.kilometros_recorridos || 0), 0) /
    total || 0;

  const modoCounts = reports.reduce((acc, r) => {
    const modo = r.modo_de_activacion || "otro";
    acc[modo] = (acc[modo] || 0) + 1;
    return acc;
  }, {});

  const modoData = reportWayChoices.map((choice) => ({
    name: choice.name,
    value: modoCounts[choice.id] || 0,
  }));


  const dailyCounts = {};
  reports.forEach((r) => {
    if (r.tiempo_fecha) {
      const date = r.tiempo_fecha.split('T')[0];
      dailyCounts[date] = (dailyCounts[date] || 0) + 1;
    }
  });
  const dailyReportsData = Object.entries(dailyCounts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);


  const turnCounts = {};
  if (turnReports) {
    turnReports.forEach((r) => {
      const turn = r.turno || "Sin especificar";
      turnCounts[turn] = (turnCounts[turn] || 0) + 1;
    });
  }
  const turnData = Object.entries(turnCounts).map(([turno, cantidad]) => ({
    turno,
    cantidad,
  }));

  const recentReports = [...reports].slice(0, 5);

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Reportes</Typography>
              <Typography variant="h4">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Usuarios</Typography>
              <Typography variant="h4">
                {usersLoading ? "..." : totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tiempo Prom. Traslado (min)</Typography>
              <Typography variant="h4">{avgTraslado.toFixed(1)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Km Promedio Recorridos</Typography>
              <Typography variant="h4">{avgKm.toFixed(1)}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reportes por Día
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyReportsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#8884d8"
                    name="Reportes"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reportes por Modo de Activación
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={modoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {modoData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución de Reportes Urbanos
              </Typography>
              {turnReportsLoading ? (
                <Typography>Cargando...</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={turnData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="turno" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Cantidad de Reportes"
                      dataKey="cantidad"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Reportes Recientes
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Folio</TableCell>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Modo</TableCell>
                    <TableCell>Ubicación</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentReports.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.folio}</TableCell>
                      <TableCell>
                        {new Date(r.tiempo_fecha).toLocaleString()}
                      </TableCell>
                      <TableCell>{r.modo_de_activacion}</TableCell>
                      <TableCell>{r.ubi || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
