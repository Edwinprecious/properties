import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {Container, Row,Col, Card, Button, Form, Spinner, Alert} from "react-bootstrap";
import toast from 'react-hot-toast';
import {fetchPropertyById, uploadCoverImage, uploadAdditionalImages, updateProperty, deleteProperty} from "../../services/api"; // adjust path

const EditProperty = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: "",
    address: "",
    description: "",
    category: "rent",
    status: "active",
    bedrooms: "",
    bathrooms: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    try {
      const data = await fetchPropertyById(id);
      const property = data.data;
      setFormData({
        title: property.title || "",
        price: property.price || "",
        location: property.location || "",
        address: property.address || "",
        description: property.description || "",
        category: property.category || "rent",
        status: property.status || "active",
        bedrooms: property.bedrooms || "",
        bathrooms: property.bathrooms || "",
      });
      setCoverImage(property.image_url || null);
      setAdditionalImages(property.images || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await uploadCoverImage(file);
      setCoverImage(data.image_url);
      toast.success("Cover image uploaded successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAdditionalImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    try {
      const data = await uploadAdditionalImages(files);
      setAdditionalImages((prev) => [...prev, ...data.image_urls]);
      toast.success(`${data.image_urls.length} images uploaded successfully!`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        cover_image: coverImage,
        images: additionalImages,
      };
      await updateProperty(id, propertyData);
      toast.success("Property updated successfully!");
      navigate("/admin/properties");
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      await deleteProperty(id);
      toast.success("Property deleted successfully!");
      navigate("/admin/properties");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error && !formData.title) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <Button variant="primary" onClick={() => navigate("/admin/properties")}>
            Back to Properties
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Edit Property</h1>
          <p className="text-muted">Update property details</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Basic Information */}
            <h4 className="fw-semibold mb-3">Basic Information</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Title *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price (₦) *</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="rent">Rent</option>
                    <option value="sell">Sell</option>
                    <option value="land">Land</option>
                    <option value="airbnb">Airbnb</option>
                    <option value="buy">Buy</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="rented">Rented</option>
                    <option value="occupied">Occupied</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* Property Details */}
            <h4 className="fw-semibold mt-4 mb-3">Property Details</h4>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bedrooms</Form.Label>
                  <Form.Control
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bathrooms</Form.Label>
                  <Form.Control
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>

             {/* Images */}
            <h4 className="fw-semibold mt-4 mb-3">Images</h4>
            <Form.Group className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              {coverImage && (
                <div className="mb-2">
                  <img
                    src={`http://127.0.0.1:5000${coverImage}`}
                    alt="Cover"
                    className="rounded border"
                    style={{ width: 120, height: 120, objectFit: "cover" }}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional Images</Form.Label>
              {additionalImages.length > 0 && (
                <Row className="mb-2">
                  {additionalImages.map((img, idx) => (
                    <Col xs={4} md={3} key={idx}>
                      <img
                        src={`http://127.0.0.1:5000${img}`}
                        alt={`Additional ${idx + 1}`}
                        className="rounded border mb-2"
                        style={{ width: "100%", height: 100, objectFit: "cover" }}
                      />
                    </Col>
                  ))}
                </Row>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleAdditionalImagesUpload}
              />
            </Form.Group>

            {/* Action Buttons */}
            <div className="d-flex gap-3 mt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/admin/properties")}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                className="ms-auto"
                onClick={handleDelete}
              >
                <i className="bi bi-trash me-2"></i> Delete Property
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditProperty;
