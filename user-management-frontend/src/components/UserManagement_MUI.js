import React, { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Box,
  Paper,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Dialog as AlertDialog,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as ChangePasswordIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { userAPI } from '../services/userAPI';
import './UserManagement.css';

export default function UserManagement() {
  // State für Authentifizierung
  const [superAdminUsername, setSuperAdminUsername] = useState('superadmin');
  const [superAdminPassword, setSuperAdminPassword] = useState('admin123');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // State für Benutzerliste
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State für Modal (Erstellen/Bearbeiten)
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mail: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  // State für Passwort ändern Modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordUserId, setPasswordUserId] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  /**
   * Login Handler
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await userAPI.getAllUsers(superAdminUsername, superAdminPassword);
      setIsAuthenticated(true);
      setSuccess('Erfolgreich als SuperAdmin angemeldet!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Login fehlgeschlagen: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout Handler
   */
  const handleLogout = () => {
    setIsAuthenticated(false);
    setSuperAdminPassword('');
    setUsers([]);
  };

  /**
   * Lade alle Benutzer
   */
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('Loading users with credentials:', superAdminUsername);
      const data = await userAPI.getAllUsers(superAdminUsername, superAdminPassword);
      console.log('Users loaded:', data);
      setUsers(data);
    } catch (err) {
      console.error('Load users error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lade Benutzer nach dem Login
   */
  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  /**
   * Handle Modal öffnen/schließen
   */
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        password: '',
        mail: user.mail,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: '',
        password: '',
        mail: '',
        firstName: '',
        lastName: '',
        phone: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      username: '',
      password: '',
      mail: '',
      firstName: '',
      lastName: '',
      phone: ''
    });
  };

  /**
   * Handle Formular Submit (Erstellen/Bearbeiten)
   */
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingUser) {
        // Bearbeiten
        const updateData = {
          mail: formData.mail,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        };
        await userAPI.updateUser(editingUser.userId, updateData, superAdminUsername, superAdminPassword);
        setSuccess('Benutzer erfolgreich aktualisiert!');
      } else {
        // Erstellen
        await userAPI.createUser(formData, superAdminUsername, superAdminPassword);
        setSuccess('Benutzer erfolgreich erstellt!');
      }
      
      handleCloseModal();
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handle Benutzer löschen
   */
  const handleDeleteUser = async (id) => {
    console.log('Delete clicked for user:', id);
    if (!window.confirm('Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?')) {
      console.log('Delete cancelled by user');
      return;
    }

    setError('');
    try {
      console.log('Deleting user:', id);
      await userAPI.deleteUser(id, superAdminUsername, superAdminPassword);
      console.log('User deleted successfully');
      setSuccess('Benutzer erfolgreich gelöscht!');
      loadUsers();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
    }
  };

  /**
   * Handle Passwort ändern Modal
   */
  const handleOpenPasswordModal = (userId) => {
    setPasswordUserId(userId);
    setNewPassword('');
    setShowPasswordModal(true);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      await userAPI.changePassword(passwordUserId, newPassword, superAdminUsername, superAdminPassword);
      setSuccess('Passwort erfolgreich geändert!');
      setShowPasswordModal(false);
      setNewPassword('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  /**
   * Handle Formularfeld änderung
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Login Page
  if (!isAuthenticated) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 8, mb: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
                Benutzerverwaltung
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mb: 3 }}>
                Melden Sie sich als SuperAdmin an
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  fullWidth
                  label="Benutzername"
                  type="text"
                  value={superAdminUsername}
                  onChange={(e) => setSuperAdminUsername(e.target.value)}
                  placeholder="superadmin"
                  variant="outlined"
                />

                <TextField
                  fullWidth
                  label="Passwort"
                  type="password"
                  value={superAdminPassword}
                  onChange={(e) => setSuperAdminPassword(e.target.value)}
                  placeholder="admin123"
                  variant="outlined"
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Anmelden'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

  // Main Page nach Login
  return (
    <>
      {/* AppBar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Benutzerverwaltung
          </Typography>
          <Typography variant="body2" sx={{ mr: 2 }}>
            Angemeldet als: <strong>{superAdminUsername}</strong>
          </Typography>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Meldungen */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* "Neuer Benutzer" Button */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal()}
          >
            + Neuer Benutzer
          </Button>
        </Box>

        {/* Benutzertabelle */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Benutzername</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Telefon</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell align="center"><strong>Aktionen</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan="6" align="center" sx={{ py: 4 }}>
                      Keine Benutzer gefunden
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map(user => (
                    <TableRow key={user.userId} hover>
                      <TableCell>{user.userId}</TableCell>
                      <TableCell><strong>{user.username}</strong></TableCell>
                      <TableCell>{user.mail}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>{user.firstName} {user.lastName}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenModal(user)}
                          title="Bearbeiten"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleOpenPasswordModal(user.userId)}
                          title="Passwort ändern"
                        >
                          <ChangePasswordIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteUser(user.userId)}
                          title="Löschen"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Benutzer erstellen/bearbeiten Modal */}
      <Dialog open={showModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUser ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            autoFocus
            label="Benutzername"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            disabled={!!editingUser}
            fullWidth
            required
          />

          {!editingUser && (
            <TextField
              label="Passwort"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              required
            />
          )}

          <TextField
            label="Email"
            type="email"
            name="mail"
            value={formData.mail}
            onChange={handleInputChange}
            fullWidth
            required
          />

          <TextField
            label="Vorname"
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            fullWidth
          />

          <TextField
            label="Nachname"
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            fullWidth
          />

          <TextField
            label="Telefon"
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseModal} color="inherit">
            Abbrechen
          </Button>
          <Button onClick={handleFormSubmit} variant="contained" color="primary">
            {editingUser ? 'Aktualisieren' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Passwort ändern Modal */}
      <Dialog open={showPasswordModal} onClose={() => setShowPasswordModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Passwort ändern</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            autoFocus
            label="Neues Passwort"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setShowPasswordModal(false)} color="inherit">
            Abbrechen
          </Button>
          <Button onClick={handleChangePassword} variant="contained" color="primary">
            Passwort ändern
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
