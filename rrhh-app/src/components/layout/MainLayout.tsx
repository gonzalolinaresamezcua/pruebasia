import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Avatar, 
  Menu, 
  MenuItem, 
  Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccessTime as TimeTrackingIcon,
  Event as CalendarIcon,
  BeachAccess as VacationIcon,
  Description as DocumentsIcon,
  Person as ProfileIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  ExitToApp as LogoutIcon
} from '@mui/icons-material';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { UserRole } from '../../types';

const drawerWidth = 240;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Registro de Jornada', icon: <TimeTrackingIcon />, path: '/time-tracking' },
    { text: 'Calendario', icon: <CalendarIcon />, path: '/calendar' },
    { text: 'Vacaciones y Ausencias', icon: <VacationIcon />, path: '/absences' },
    { text: 'Documentos', icon: <DocumentsIcon />, path: '/documents' },
    { text: 'Mi Perfil', icon: <ProfileIcon />, path: '/profile' },
  ];

  // Menús adicionales para administradores y RRHH
  if (user?.role === UserRole.ADMIN || user?.role === UserRole.HR_MANAGER) {
    menuItems.push(
      { text: 'Gestión de Usuarios', icon: <UsersIcon />, path: '/users' },
      { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' }
    );
  }

  const drawer = (
    <div>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <Typography variant="h6" noWrap component="div">
          RRHH App
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Recursos Humanos
          </Typography>
          
          {/* Notificaciones */}
          <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={handleNotificationMenuClose}
            PaperProps={{
              style: {
                width: '300px',
                maxHeight: '400px',
              },
            }}
          >
            <MenuItem onClick={() => { handleNotificationMenuClose(); navigate('/notifications/1'); }}>
              <Box>
                <Typography variant="subtitle2">Documento pendiente de firma</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tienes un documento pendiente de firma
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem onClick={() => { handleNotificationMenuClose(); navigate('/notifications/2'); }}>
              <Box>
                <Typography variant="subtitle2">Solicitud de vacaciones aprobada</Typography>
                <Typography variant="body2" color="text.secondary">
                  Tu solicitud de vacaciones ha sido aprobada
                </Typography>
              </Box>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => navigate('/notifications')}>
              <Typography variant="body2" color="primary" align="center">
                Ver todas las notificaciones
              </Typography>
            </MenuItem>
          </Menu>
          
          {/* Perfil de usuario */}
          <Box sx={{ ml: 2 }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ padding: 0 }}
            >
              <Avatar 
                alt={user?.firstName} 
                src={user?.profileImage}
                sx={{ width: 32, height: 32 }}
              >
                {user?.firstName?.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleProfileMenuClose}
            >
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/profile'); }}>
                <ListItemIcon>
                  <ProfileIcon fontSize="small" />
                </ListItemIcon>
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
                <ListItemIcon>
                  <SettingsIcon fontSize="small" />
                </ListItemIcon>
                Configuración
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;