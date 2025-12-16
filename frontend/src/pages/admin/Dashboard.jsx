import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Spinner,
  Navbar,
  Nav,
  Offcanvas
} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AdminDashboard.css';
import { fetchAdminDashboardStats } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 403) {
        toast.error('Access denied. Admin only.');
        navigate('/unauthorized');
        return;
      }

      if (response.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_role');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <toast variant="danger">
          <toast.Heading>Error Loading Dashboard</toast.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={fetchDashboardStats} className="mt-3">
            Try Again
          </Button>
        </toast>
      </Container>
    );
  }

  return (
    <>
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container fluid>
          <Navbar.Brand href="#">🏢 Real Estate Admin</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="offcanvasNavbar"
            onClick={() => setShowSidebar(true)}
          />
          <Navbar.Collapse className="justify-content-end">
            <Nav>
              <Nav.Link onClick={() => navigate('/admin/profile')}>
                <i className="bi bi-person-circle me-1"></i> Profile
              </Nav.Link>
              <Nav.Link onClick={() => navigate('/logout')}>
                <i className="bi bi-box-arrow-right me-1"></i> Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Sidebar */}
      <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} backdrop="true">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link onClick={() => navigate('/admin')}>
              <i className="bi bi-speedometer2 me-2"></i> Dashboard
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/admin/properties')}>
              <i className="bi bi-building me-2"></i> Properties
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/admin/users')}>
              <i className="bi bi-people me-2"></i> Users
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/admin/inquiries')}>
              <i className="bi bi-chat-dots me-2"></i> Inquiries
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/admin/settings')}>
              <i className="bi bi-gear me-2"></i> Settings
            </Nav.Link>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Main Content */}
      <Container fluid className="bg-light min-vh-100 py-4">
        <Container>
          {/* Header */}
          <div className="mb-5">
            <h1 className="fw-bold text-dark">Admin Dashboard</h1>
            <p className="text-muted">Overview of your real estate platform</p>
          </div>

          {/* Stats Cards */}
          <Row className="mb-5 g-4">
            <Col md={6} lg={3}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="text-muted">Total Properties</Card.Title>
                  <h3 className="fw-bold">{stats?.properties?.total || 0}</h3>
                  <p className="text-muted">
                    ₦{stats?.properties?.total_value?.toLocaleString() || 0} total value
                  </p>
                  <i className="bi bi-house-door-fill text-primary fs-2"></i>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="text-muted">Total Users</Card.Title>
                  <h3 className="fw-bold">{stats?.users?.total || 0}</h3>
                  <i className="bi bi-people-fill text-success fs-2"></i>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="text-muted">Total Inquiries</Card.Title>
                  <h3 className="fw-bold">{stats?.inquiries?.total || 0}</h3>
                  <i className="bi bi-chat-dots-fill text-warning fs-2"></i>
                </Card.Body>
              </Card>
            </Col>

            <Col md={6} lg={3}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title className="text-muted">Total Favorites</Card.Title>
                  <h3 className="fw-bold">{stats?.favorites?.total || 0}</h3>
                  <i className="bi bi-heart-fill text-danger fs-2"></i>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row className="mb-5 g-3">
            <Col lg={4}>
              <Button
                variant="primary"
                className="w-100 py-3 shadow-sm"
                onClick={() => navigate('/admin/properties/add')}
              >
                <i className="bi bi-plus-circle me-2"></i> Add New Property
              </Button>
            </Col>
            <Col lg={4}>
              <Button
                variant="secondary"
                className="w-100 py-3 shadow-sm"
                onClick={() => navigate('/admin/properties')}
              >
                <i className="bi bi-card-list me-2"></i> Manage Properties
              </Button>
            </Col>
            <Col lg={4}>
              <Button
                variant="warning"
                className="w-100 py-3 shadow-sm text-white"
                onClick={() => navigate('/admin/inquiries')}
              >
                <i className="bi bi-envelope-fill me-2"></i> Manage Inquiries
              </Button>
            </Col>
          </Row>

          {/* Recent Properties */}
          {stats?.properties?.recent && stats.properties.recent.length > 0 && (
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>Recent Properties</Card.Title>
                <Table striped bordered hover responsive className="mt-3">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.properties.recent.map((prop) => (
                      <tr key={prop.id}>
                        <td>{prop.title}</td>
                        <td>{prop.location}</td>
                        <td>₦{prop.price?.toLocaleString()}</td>
                        <td>
                          <span className="badge bg-info text-dark">{prop.category}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}
        </Container>
      </Container>
    </>
  );
}

export default AdminDashboard;
      