import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Alert,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterIcon
} from '@mui/icons-material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, UserRole } from '../../types';
import authService from '../../services/authService';

// Servicio simulado para gestión de usuarios (en una aplicación real, esto estaría en un archivo separado)
const userService = {
  getUsers: async (): Promise<User[]> => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            id: '1',
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan.perez@empresa.com',
            role: UserRole.EMPLOYEE,
            department: 'Desarrollo',
            position: 'Desarrollador Frontend',
            hireDate: '2020-03-15',
            profileImage: ''
          },
          {
            id: '2',
            firstName: 'María',
            lastName: 'García',
            email: 'maria.garcia@empresa.com',
            role: UserRole.HR_MANAGER,
            department: 'Recursos Humanos',
            position: 'Gerente de RRHH',
            hireDate: '2018-06-10',
            profileImage: ''
          },
          {
            id: '3',
            firstName: 'Carlos',
            lastName: 'Rodríguez',
            email: 'carlos.rodriguez@empresa.com',
            role: UserRole.ADMIN,
            department: 'Tecnología',
            position: 'Director de TI',
            hireDate: '2017-01-20',
            profileImage: ''
          },
          {
            id: '4',
            firstName: 'Ana',
            lastName: 'Martínez',
            email: 'ana.martinez@empresa.com',
            role: UserRole.EMPLOYEE,
            department: 'Marketing',
            position: 'Especialista en Marketing Digital',
            hireDate: '2021-02-05',
            profileImage: ''
          },
          {
            id: '5',
            firstName: 'Pedro',
            lastName: 'Sánchez',
            email: 'pedro.sanchez@empresa.com',
            role: UserRole.EMPLOYEE,
            department: 'Finanzas',
            position: 'Analista Financiero',
            hireDate: '2019-11-12',
            profileImage: ''
          }
        ]);
      }, 500);
    });
  },
  
  deleteUser: async (userId: string): Promise<boolean> => {
    // Simulación de llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
};

// Esquema de validación para crear/editar usuario
const UserSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('El nombre es obligatorio')
    .max(50, 'El nombre no puede exceder los 50 caracteres'),
  lastName: Yup.string()
    .required('Los apellidos son obligatorios')
    .max(50, 'Los apellidos no pueden exceder los 50 caracteres'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es obligatorio'),
  role: Yup.string()
    .required('El rol es obligatorio'),
  department: Yup.string()
    .required('El departamento es obligatorio'),
  position: Yup.string()
    .required('El puesto es obligatorio'),
  hireDate: Yup.date()
    .required('La fecha de contratación es obligatoria')
    .max(new Date(), 'La fecha de contratación no puede ser futura'),
  password: Yup.string()
    .when('isNewUser', {
      is: true,
      then: Yup.string()
        .required('La contraseña es obligatoria')
        .min(8, 'La contraseña debe tener al menos 8 caracteres'),
      otherwise: Yup.string()
    })
});

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await userService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
      
      setLoading(false);
    } catch (error) {
      setError('Error al cargar los usuarios');
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenNewUserDialog = () => {
    setSelectedUser(null);
    setIsNewUser(true);
    setOpenUserDialog(true);
  };

  const handleOpenEditUserDialog = (user: User) => {
    setSelectedUser(user);
    setIsNewUser(false);
    setOpenUserDialog(true);
  };

  const handleCloseUserDialog = () => {
    setOpenUserDialog(false);
  };

  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setLoading(true);
      
      await userService.deleteUser(userToDelete.id);
      
      // Actualizar la lista de usuarios
      setUsers(users.filter(user => user.id !== userToDelete.id));
      setFilteredUsers(filteredUsers.filter(user => user.id !== userToDelete.id));
      
      setSuccess(`Usuario ${userToDelete.firstName} ${userToDelete.lastName} eliminado correctamente`);
      handleCloseDeleteDialog();
      
      setLoading(false);
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      setError('Error al eliminar el usuario');
      setLoading(false);
    }
  };

  const handleSubmitUser = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isNewUser) {
        // Simular creación de usuario
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          role: values.role,
          department: values.department,
          position: values.position,
          hireDate: format(new Date(values.hireDate), 'yyyy-MM-dd'),
          profileImage: ''
        };
        
        // En una aplicación real, aquí se llamaría a la API
        // await authService.register(newUser, values.password);
        
        setUsers([...users, newUser]);
        setFilteredUsers([...filteredUsers, newUser]);
        setSuccess('Usuario creado correctamente');
      } else {
        // Simular actualización de usuario
        const updatedUsers = users.map(user => 
          user.id === selectedUser?.id 
            ? { 
                ...user, 
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                role: values.role,
                department: values.department,
                position: values.position,
                hireDate: format(new Date(values.hireDate), 'yyyy-MM-dd')
              } 
            : user
        );
        
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setSuccess('Usuario actualizado correctamente');
      }
      
      setLoading(false);
      handleCloseUserDialog();
      
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      setError(`Error al ${isNewUser ? 'crear' : 'actualizar'} el usuario`);
      setLoading(false);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Traducir rol de usuario
  const getRoleText = (role: UserRole): string => {
    const roles: Record<UserRole, string> = {
      [UserRole.EMPLOYEE]: 'Empleado',
      [UserRole.HR_MANAGER]: 'Gestor RRHH',
      [UserRole.ADMIN]: 'Administrador',
    };
    return roles[role] || role;
  };

  // Obtener color según el rol
  const getRoleChip = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Chip label={getRoleText(role)} color="error" size="small" />;
      case UserRole.HR_MANAGER:
        return <Chip label={getRoleText(role)} color="warning" size="small" />;
      case UserRole.EMPLOYEE:
        return <Chip label={getRoleText(role)} color="primary" size="small" />;
      default:
        return <Chip label={getRoleText(role)} size="small" />;
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNewUserDialog}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
            <Typography variant="body2" color="text.secondary">
              Total: {filteredUsers.length} usuarios
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Paper elevation={2}>
        {loading && users.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredUsers.length > 0 ? (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Departamento</TableCell>
                    <TableCell>Puesto</TableCell>
                    <TableCell>Rol</TableCell>
                    <TableCell>Fecha Contratación</TableCell>
                    <TableCell align="center">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>{user.position}</TableCell>
                        <TableCell>{getRoleChip(user.role)}</TableCell>
                        <TableCell>
                          {format(new Date(user.hireDate), 'dd/MM/yyyy', { locale: es })}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Editar">
                            <IconButton 
                              color="primary"
                              onClick={() => handleOpenEditUserDialog(user)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton 
                              color="error"
                              onClick={() => handleOpenDeleteDialog(user)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredUsers.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelRowsPerPage="Filas por página:"
              labelDisplayedRows={({ from, to, count }) =>
                `${from}-${to} de ${count}`
              }
            />
          </>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="body1">
              No se encontraron usuarios.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Diálogo para crear/editar usuario */}
      <Dialog
        open={openUserDialog}
        onClose={handleCloseUserDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isNewUser ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
        </DialogTitle>
        <Formik
          initialValues={{
            firstName: selectedUser?.firstName || '',
            lastName: selectedUser?.lastName || '',
            email: selectedUser?.email || '',
            role: selectedUser?.role || UserRole.EMPLOYEE,
            department: selectedUser?.department || '',
            position: selectedUser?.position || '',
            hireDate: selectedUser?.hireDate ? new Date(selectedUser.hireDate) : new Date(),
            password: '',
            isNewUser: isNewUser
          }}
          validationSchema={UserSchema}
          onSubmit={handleSubmitUser}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form>
              <DialogContent>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="firstName"
                      name="firstName"
                      label="Nombre"
                      error={touched.firstName && Boolean(errors.firstName)}
                      helperText={touched.firstName && errors.firstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="lastName"
                      name="lastName"
                      label="Apellidos"
                      error={touched.lastName && Boolean(errors.lastName)}
                      helperText={touched.lastName && errors.lastName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      error={touched.email && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl 
                      fullWidth 
                      error={touched.role && Boolean(errors.role)}
                    >
                      <InputLabel id="role-label">Rol</InputLabel>
                      <Field
                        as={Select}
                        labelId="role-label"
                        id="role"
                        name="role"
                        label="Rol"
                      >
                        <MenuItem value={UserRole.EMPLOYEE}>Empleado</MenuItem>
                        <MenuItem value={UserRole.HR_MANAGER}>Gestor RRHH</MenuItem>
                        <MenuItem value={UserRole.ADMIN}>Administrador</MenuItem>
                      </Field>
                      {touched.role && errors.role && (
                        <Typography variant="caption" color="error">
                          {errors.role as string}
                        </Typography>
                      )}
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="department"
                      name="department"
                      label="Departamento"
                      error={touched.department && Boolean(errors.department)}
                      helperText={touched.department && errors.department}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="position"
                      name="position"
                      label="Puesto"
                      error={touched.position && Boolean(errors.position)}
                      helperText={touched.position && errors.position}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      as={TextField}
                      fullWidth
                      id="hireDate"
                      name="hireDate"
                      label="Fecha de Contratación"
                      type="date"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      value={format(values.hireDate, 'yyyy-MM-dd')}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setFieldValue('hireDate', new Date(e.target.value));
                      }}
                      error={touched.hireDate && Boolean(errors.hireDate)}
                      helperText={touched.hireDate && errors.hireDate}
                    />
                  </Grid>
                  {isNewUser && (
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        fullWidth
                        id="password"
                        name="password"
                        label="Contraseña"
                        type="password"
                        error={touched.password && Boolean(errors.password)}
                        helperText={touched.password && errors.password}
                      />
                    </Grid>
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseUserDialog}>Cancelar</Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : isNewUser ? 'Crear' : 'Guardar'}
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      {/* Diálogo de confirmación para eliminar usuario */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirmar Eliminación</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            ¿Estás seguro de que deseas eliminar al usuario {userToDelete?.firstName} {userToDelete?.lastName}?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button 
            onClick={handleDeleteUser} 
            variant="contained" 
            color="error"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;