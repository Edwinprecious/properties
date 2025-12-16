import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Container, Row, Col, Card, Button, Form, Table, Spinner, Alert} from "react-bootstrap";
import { toast } from 'react-hot-toast';
import { fetchProperties, deleteProperty } from '../../services/api';

const ManageProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProperties();
  }, [categoryFilter]);

  // Remaining function: loadProperties (calls fetchProperties from api.js)
  const loadProperties = async () => {
    try {
      const data = await fetchProperties(categoryFilter);
      console.log("Fetched properties:", data);
      setProperties(data.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remaining function: handleDelete (calls deleteProperty from api.js)
  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(propertyId);
      toast.success("Property deleted successfully!");
      loadProperties();
    } catch (err) {
      toast.error("Error deleting property: " + err.message);
    }
  };

  // Filtering logic stays here
  const filteredProperties = properties.filter(
    (prop) =>
      prop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="fw-bold">Manage Properties</h1>
          <p className="text-muted">{properties.length} total properties</p>
        </Col>
        <Col className="text-end">
          <Button
            variant="primary"
            onClick={() => navigate("/admin/properties/add")}
          >
            <i className="bi bi-plus-circle me-2"></i> Add New Property
          </Button>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col md={6}>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="rent">Rent</option>
                <option value="sell">Sell</option>
                <option value="land">Land</option>
                <option value="airbnb">Airbnb</option>
                <option value="buy">Buy</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Properties Table */}
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Price</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td>
                      <img
                        src={
                          property.image_url
                            ? `http://127.0.0.1:5000${property.image_url}`
                            : "https://via.placeholder.com/80"
                        }
                        alt={property.title}
                        className="rounded"
                        style={{ width: 80, height: 80, objectFit: "cover" }}
                      />
                    </td>
                    <td className="fw-semibold">{property.title}</td>
                    <td>📍 {property.location}</td>
                    <td className="fw-bold">
                      ₦{property.price?.toLocaleString()}
                    </td>
                    <td>
                      <span className="badge bg-info text-dark">
                        {property.category}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          property.status === "active"
                            ? "bg-success"
                            : property.status === "sold"
                            ? "bg-danger"
                            : "bg-secondary"
                        }`}
                      >
                        {property.status}
                      </span>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() =>
                          navigate(`/admin/properties/edit/${property.id}`)
                        }
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(property.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-muted py-4">
                    No properties found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageProperties;
