import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {Container, Row, Col, Form, Button, Card} from "react-bootstrap";
import {uploadCoverImage, uploadAdditionalImages, createProperty} from '../../services/api'
import toast from 'react-hot-toast'
const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    address: '',
    description: '',
    category: 'rent',
    status: 'active',
    bedrooms: '',
    bathrooms: '',
  });

  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Call reusable API functions
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
    setLoading(true);
    setError(null);
    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        image_url: coverImage,
        images: additionalImages,
      };
      await createProperty(propertyData);
      toast.success("Property created successfully!");
      navigate("/admin/properties");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
console.log('coverImage', coverImage);
console.log('additionalImages', additionalImages);

  return (
  <Container className="py-5">
    <Row className="justify-content-center">
      <Col md={10} lg={8}>
        <h2 className="fw-bold mb-2">
          <i className="bi bi-plus-circle me-2 text-primary"></i> Add New Property
        </h2>
        <p className="text-muted mb-4">Fill in the details to list a new property</p>

        {error && <toast variant="danger">{error}</toast>}

        <Card className="shadow-sm">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* BASIC INFO */}
              <Card className="mb-4 border-0">
                <Card.Header className="bg-light fw-semibold">
                  <i className="bi bi-info-circle me-2 text-secondary"></i> Basic Information
                </Card.Header>
                <Card.Body>
                  <Row>
                    {/* Title */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          placeholder="Luxury Apartment"
                          required
                        />
                      </Form.Group>
                    </Col>
                    {/* Price */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Price (₦) *</Form.Label>
                        <Form.Control
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          placeholder="5000000"
                          required
                        />
                      </Form.Group>
                    </Col>
                    {/* Location */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Location *</Form.Label>
                        <Form.Control
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="Lagos"
                          required
                        />
                      </Form.Group>
                    </Col>
                    {/* Address */}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          placeholder="123 Lekki Phase 1"
                        />
                      </Form.Group>
                    </Col>
                    {/* Category */}
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
                    {/* Status */}
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
                </Card.Body>
              </Card>

              {/* PROPERTY DETAILS */}
              <Card className="mb-4 border-0">
                <Card.Header className="bg-light fw-semibold">
                  <i className="bi bi-building me-2 text-secondary"></i> Property Details
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Bedrooms</Form.Label>
                        <Form.Control
                          type="number"
                          name="bedrooms"
                          value={formData.bedrooms}
                          onChange={handleChange}
                          placeholder="3"
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
                          placeholder="2"
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
                      placeholder="Enter property description..."
                    />
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* IMAGES */}
              <Card className="mb-4 border-0">
                <Card.Header className="bg-light fw-semibold">
                  <i className="bi bi-image me-2 text-secondary"></i> Images
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Cover Image</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleCoverImageUpload} />
                    {coverImage && (
                      <img
                        src={`http://127.0.0.1:5000${coverImage}`}
                        className="mt-2 rounded border"
                        style={{ width: 120, height: 120, objectFit: "cover" }}
                      />
                    )}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Additional Images</Form.Label>
                    <Form.Control type="file" accept="image/*" multiple onChange={handleAdditionalImagesUpload} />
                    <Row className="mt-3">
                      {additionalImages.map((img, idx) => (
                        <Col xs={6} md={4} key={idx}>
                          <img
                            src={`http://127.0.0.1:5000${img}`}
                            className="rounded border mb-2"
                            style={{ width: "100%", height: 100, objectFit: "cover" }}
                          />
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>
                </Card.Body>
              </Card>

              {/* Buttons */}
              <div className="d-flex gap-3 mt-4">
                <Button type="submit" variant="primary" disabled={loading}>
                  <i className="bi bi-check-circle me-2"></i>
                  {loading ? "Creating..." : "Create Property"}
                </Button>
                <Button variant="secondary" onClick={() => navigate("/admin/properties")}>
                  <i className="bi bi-x-circle me-2"></i> Cancel
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);
};

export default AddProperty;
