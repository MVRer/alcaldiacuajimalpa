import React, { useMemo } from 'react';
import { useGetList, usePermissions } from 'react-admin';
import { Navigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  CircularProgress
} from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const KPICard = ({ title, value, icon: Icon, loading }) => (
  <Card elevation={2}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" variant="body2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {loading ? <CircularProgress size={24} /> : value}
          </Typography>
        </Box>
        {Icon && (
          <Box
            sx={{
              backgroundColor: 'primary.main',
              borderRadius: '50%',
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color: 'white', fontSize: 32 }} />
          </Box>
        )}
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { permissions } = usePermissions();

  // Fetch data from all endpoints
  const { data: reports, isLoading: reportsLoading } = useGetList('reports', {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'id', order: 'DESC' }
  });

  const { data: users, isLoading: usersLoading } = useGetList('users', {
    pagination: { page: 1, perPage: 1000 }
  });

  const { data: turnReports, isLoading: turnReportsLoading } = useGetList('turn-reports', {
    pagination: { page: 1, perPage: 1000 }
  });

  // Permission check - keep existing logic
  if (!permissions?.includes('*')) {
    return <Navigate to="/#" replace />;
  }

  // Calculate KPIs
  const totalReports = reports?.length || 0;
  const totalUsers = users?.length || 0;

  const avgTravelTime = useMemo(() => {
    if (!reports || reports.length === 0) return 0;
    const validReports = reports.filter(r => r.tiempo_traslado != null);
    if (validReports.length === 0) return 0;
    const sum = validReports.reduce((acc, r) => acc + parseFloat(r.tiempo_traslado || 0), 0);
    return (sum / validReports.length).toFixed(1);
  }, [reports]);

  const avgKm = useMemo(() => {
    if (!reports || reports.length === 0) return 0;
    const validReports = reports.filter(r => r.km_recorridos != null);
    if (validReports.length === 0) return 0;
    const sum = validReports.reduce((acc, r) => acc + parseFloat(r.km_recorridos || 0), 0);
    return (sum / validReports.length).toFixed(1);
  }, [reports]);

  // Prepare Pie Chart data (Modo de Activación)
  const modeData = useMemo(() => {
    if (!reports) return [];
    const modes = {};
    reports.forEach(r => {
      const mode = r.modo_activacion || 'Sin especificar';
      modes[mode] = (modes[mode] || 0) + 1;
    });
    return Object.entries(modes).map(([name, value]) => ({ name, value }));
  }, [reports]);

  // NEW: Prepare Line Chart data (Reportes por Día)
  const dailyReportsData = useMemo(() => {
    if (!reports) return [];
    const dailyCounts = {};
    reports.forEach(r => {
      if (r.tiempo_fecha) {
        // Extract YYYY-MM-DD from tiempo_fecha
        const date = r.tiempo_fecha.split('T')[0];
        dailyCounts[date] = (dailyCounts[date] || 0) + 1;
      }
    });
    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30); // Show last 30 days
  }, [reports]);

  // NEW: Prepare Radar Chart data (Distribución por Turno)
  const turnData = useMemo(() => {
    if (!turnReports) return [];
    const turns = {};
    turnReports.forEach(r => {
      const turn = r.turno || 'Sin especificar';
      turns[turn] = (turns[turn] || 0) + 1;
    });
    return Object.entries(turns).map(([turno, cantidad]) => ({ turno, cantidad }));
  }, [turnReports]);

  // Recent reports for table
  const recentReports = useMemo(() => {
    if (!reports) return [];
    return reports.slice(0, 5);
  }, [reports]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Top Row: 4 KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Reportes"
            value={totalReports}
            icon={AssessmentIcon}
            loading={reportsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Total Usuarios"
            value={totalUsers}
            icon={PeopleIcon}
            loading={usersLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Tiempo Prom. Traslado (min)"
            value={avgTravelTime}
            icon={TimerIcon}
            loading={reportsLoading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <KPICard
            title="Km Promedio Recorridos"
            value={avgKm}
            icon={DirectionsCarIcon}
            loading={reportsLoading}
          />
        </Grid>
      </Grid>

      {/* Middle Section: Line Chart - Reportes por Día */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader title="Reportes por Día" />
            <CardContent>
              {reportsLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
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
                    <RechartsTooltip />
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
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Middle Section: Pie Chart and Radar Chart side by side */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="Reportes por Modo de Activación" />
            <CardContent>
              {reportsLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={modeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {modeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={2}>
            <CardHeader title="Distribución de Reportes Urbanos" />
            <CardContent>
              {turnReportsLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
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
                    <RechartsTooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Bottom Section: Recent Reports Table */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardHeader title="Reportes Recientes" />
            <CardContent>
              {reportsLoading ? (
                <Box display="flex" justifyContent="center" p={3}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Fecha</TableCell>
                      <TableCell>Modo Activación</TableCell>
                      <TableCell>Tiempo Traslado (min)</TableCell>
                      <TableCell>Km Recorridos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>{report.id}</TableCell>
                        <TableCell>
                          {report.tiempo_fecha
                            ? new Date(report.tiempo_fecha).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>{report.modo_activacion || 'N/A'}</TableCell>
                        <TableCell>{report.tiempo_traslado || 'N/A'}</TableCell>
                        <TableCell>{report.km_recorridos || 'N/A'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;