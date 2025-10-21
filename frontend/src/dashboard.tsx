import * as React from "react";
import { useGetList } from "react-admin";
import { usePermissions, Title } from 'react-admin';
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
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const reportWayChoices = [
  { id: "C5", name: "C5" },
  { id: "C3", name: "C3" },
  { id: "Policia", name: "Policia" },
  { id: "Directo", name: "Directo" },
  { id: "otro", name: "Otro" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export const Dashboard = () => {
  const isLoading = false;
    const { permissions } = usePermissions();

    if (!permissions?.includes('*')) {
      return <Navigate to="/#" replace />;
    }

  const { data: reports } = useGetList("reports", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "id", order: "DESC" },
  });

  if (isLoading) return <p>Cargando...</p>;
  if (!reports) return <p>No hay reportes</p>;

  const total = reports.length;
  const avgTraslado =
    reports.reduce((sum, r) => sum + (r.tiempo_translado || 0), 0) / total || 0;
  const avgKm =
    reports.reduce((sum, r) => sum + (r.kilometros_recorridos || 0), 0) /
      total || 0;

  const modoCounts = reports.reduce<Record<string, number>>((acc, r) => {
    const modo = r.modo_de_activacion || "otro";
    acc[modo] = (acc[modo] || 0) + 1;
    return acc;
  }, {});

  const modoData = reportWayChoices.map((choice) => ({
    name: choice.name,
    value: modoCounts[choice.id] || 0,
  }));

  const recentReports = [...reports].slice(0, 5);

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Reportes</Typography>
              <Typography variant="h4">{total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Tiempo Prom. Traslado (min)</Typography>
              <Typography variant="h4">{avgTraslado.toFixed(1)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Km Promedio Recorridos</Typography>
              <Typography variant="h4">{avgKm.toFixed(1)}</Typography>
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
