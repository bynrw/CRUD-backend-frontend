import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Alert, Container, Row, Col } from 'react-bootstrap';
import { userAPI } from '../services/userAPI';
import 'bootstrap/dist/css/bootstrap.min.css';
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
      // Versuche Benutzer abzurufen um zu prüfen ob Login erfolgreich
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
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="login-container">
              <h1 className="text-center mb-4">Benutzerverwaltung</h1>
              <p className="text-center text-muted mb-4">Melden Sie sich als SuperAdmin an</p>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Benutzername</Form.Label>
                  <Form.Control
                    type="text"
                    value={superAdminUsername}
                    onChange={(e) => setSuperAdminUsername(e.target.value)}
                    placeholder="superadmin"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Passwort</Form.Label>
                  <Form.Control
                    type="password"
                    value={superAdminPassword}
                    onChange={(e) => setSuperAdminPassword(e.target.value)}
                    placeholder="admin123"
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                  {loading ? 'Wird angemeldet...' : 'Anmelden'}
                </Button>
              </Form>

              <div className="mt-3 p-3 bg-light rounded">
                <p className="mb-0 small"><strong>Demo Zugangsdaten:</strong></p>
                <p className="mb-0 small">Benutzer: <code>superadmin</code></p>
                <p className="mb-0 small">Passwort: <code>admin123</code></p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Hauptseite
  return (
    <Container fluid className="mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h1>Benutzerverwaltung</h1>
          <p className="text-muted">Verwalten Sie alle Benutzer des Systems</p>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => handleOpenModal()} className="me-2">
            + Neuer Benutzer
          </Button>
          <Button variant="outline-secondary" onClick={handleLogout}>
            Abmelden
          </Button>
        </Col>
      </Row>

      {/* Benachrichtigungen */}
      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}

      {/* Benutzertabelle */}
      {loading ? (
        <div className="text-center py-5">
          <p>Lädt...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="user-table">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Benutzername</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Name</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">Keine Benutzer gefunden</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.mail}</td>
                    <td>{user.phone}</td>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" onClick={() => handleOpenModal(user)} className="me-1">
                        ✎
                      </Button>
                      <Button size="sm" variant="outline-warning" onClick={() => handleOpenPasswordModal(user.userId)} className="me-1">
                        🔑
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDeleteUser(user.userId)}>
                        🗑
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}

      {/* Benutzer erstellen/bearbeiten Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingUser ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Benutzername</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!!editingUser}
                required
              />
            </Form.Group>

            {!editingUser && (
              <Form.Group className="mb-3">
                <Form.Label>Passwort</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="mail"
                value={formData.mail}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Vorname</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nachname</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>

            <div className="text-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
                Abbrechen
              </Button>
              <Button variant="primary" type="submit">
                {editingUser ? 'Aktualisieren' : 'Erstellen'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Passwort ändern Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Passwort ändern</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleChangePassword}>
            <Form.Group className="mb-3">
              <Form.Label>Neues Passwort</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)} className="me-2">
                Abbrechen
              </Button>
              <Button variant="primary" type="submit">
                Passwort ändern
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
