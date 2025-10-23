import * as React from "react";
import { useState } from "react";
import { useLogin } from "react-admin";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  PersonOutline,
  LockOutlined,
} from "@mui/icons-material";

export const loginPage = () => {
  const login = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña");
      return;
    }

    setLoading(true);

    try {
      await login({ username, password });
    } catch (err) {
      console.error("Login error:", err);
      setError("Usuario o contraseña incorrectos");
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: 'url("/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#2d5016",
              padding: 5,
              textAlign: "center",
            }}
          >
            <Box
              component="img"
              src="/logo-horizontal-blanco.png"
              alt="Cuajimalpa de Morelos"
              sx={{
                maxWidth: "280px",
                width: "100%",
                height: "auto",
                marginBottom: 3,
                filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
              }}
            />
            <Typography
              variant="h4"
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 1,
                letterSpacing: "0.5px",
              }}
            >
              Sistema Paramedia
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.9)",
                fontSize: "0.95rem",
              }}
            >
              Alcaldía Cuajimalpa de Morelos
            </Typography>
          </Box>

          <CardContent sx={{ p: 5 }}>
            <Typography
              variant="h6"
              align="center"
              sx={{
                mb: 3,
                color: "text.secondary",
                fontWeight: 500,
              }}
            >
              Ingresa tus credenciales
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Usuario"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                margin="normal"
                variant="outlined"
                autoComplete="username"
                autoFocus
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#4a7c2c" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a7c2c",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#4a7c2c",
                  },
                }}
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                variant="outlined"
                autoComplete="current-password"
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined sx={{ color: "#4a7c2c" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="mostrar contraseña"
                        onClick={handleClickShowPassword}
                        edge="end"
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    "&.Mui-focused fieldset": {
                      borderColor: "#4a7c2c",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#4a7c2c",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  py: 1.8,
                  textTransform: "none",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  backgroundColor: "#4a7c2c",
                  boxShadow: "0 4px 15px rgba(74, 124, 44, 0.3)",
                  "&:hover": {
                    backgroundColor: "#3d6623",
                    boxShadow: "0 6px 20px rgba(74, 124, 44, 0.4)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {loading ? (
                  <CircularProgress size={26} sx={{ color: "white" }} />
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>
            </form>

            <Box textAlign="center" mt={4}>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                  lineHeight: 1.6,
                }}
              >
                © {new Date().getFullYear()} Alcaldía Cuajimalpa de Morelos
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  display: "block",
                }}
              >
                Sistema Paramedia - Todos los derechos reservados
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default loginPage;
