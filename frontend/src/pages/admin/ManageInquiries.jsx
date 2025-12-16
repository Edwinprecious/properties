import React, { useState, useEffect } from "react";
import {Container, Row,Col,Card, Button, Form, Table, Spinner, Alert, Modal} from "react-bootstrap";
import { toast } from 'react-hot-toast';
import {fetchInquiries, updateInquiryStatus, deleteInquiry} from "../../services/api"; 

const ManageInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  useEffect(() => {
    loadInquiries();
  }, [statusFilter]);

  // Remaining function: loadInquiries (calls fetchInquiries from api.js)
  const loadInquiries = async () => {
    try {
      const data = await fetchInquiries(statusFilter);
      setInquiries(data.data || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remaining function: handleStatusUpdate (calls updateInquiryStatus from api.js)
  const handleStatusUpdate = async (inquiryId, newStatus) => {
    try {
      await updateInquiryStatus(inquiryId, newStatus);
      toast.success("Inquiry status updated!");
      loadInquiries();
    } catch (err) {
      toast.error("Error updating status: " + err.message);
    }
  };

  // Remaining function: handleDelete (calls deleteInquiry from api.js)
  const handleDelete = async (inquiryId) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    try {
      await deleteInquiry(inquiryId);
      toast.success("Inquiry deleted successfully!");
      loadInquiries();
    } catch (err) {
      toast.error("Error deleting inquiry: " + err.message);
    }
  };

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
      <Row className="mb-4">
        <Col>
          <h1 className="fw-bold">Manage Inquiries</h1>
          <p className="text-muted">{inquiries.length} total inquiries</p>
        </Col>
      </Row>

      {/* Filter */}
      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm="3" className="fw-semibold">
              Filter by Status:
            </Form.Label>
            <Col sm="9">
              <Form.Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Inquiries</option>
                <option value="pending">Pending</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </Form.Select>
            </Col>
          </Form.Group>
        </Card.Body>
      </Card>

      {/* Inquiries Table */}
      <Card className="shadow-sm">
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>User</th>
                <th>Property</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length > 0 ? (
                inquiries.map((inquiry) => (
                  <tr key={inquiry.id}>
                    <td>
                      <div>
                        <strong>{inquiry.user_name_db}</strong>
                        <br />
                        <small className="text-muted">{inquiry.user_email_db}</small>
                      </div>
                    </td>
                    <td>
                      <div>
                        <strong>{inquiry.property_title}</strong>
                        <br />
                        <small className="text-muted">📍 {inquiry.property_location}</small>
                      </div>
                    </td>
                    <td>
                      {inquiry.message.length > 50
                        ? `${inquiry.message.substring(0, 50)}...`
                        : inquiry.message}
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 ms-2"
                        onClick={() => setSelectedInquiry(inquiry)}
                      >
                        View
                      </Button>
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={inquiry.status}
                        onChange={(e) =>
                          handleStatusUpdate(inquiry.id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="responded">Responded</option>
                        <option value="closed">Closed</option>
                      </Form.Select>
                    </td>
                    <td>{new Date(inquiry.created_at).toLocaleDateString()}</td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(inquiry.id)}
                      >
                        <i className="bi bi-trash"></i> Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    No inquiries found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Inquiry Detail Modal */}
      <Modal
        show={!!selectedInquiry}
        onHide={() => setSelectedInquiry(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Inquiry Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInquiry && (
            <>
              <p><strong>Property:</strong> {selectedInquiry.property_title}</p>
              <p><strong>From:</strong> {selectedInquiry.user_name_db}</p>
              <p className="text-muted">{selectedInquiry.user_email_db}</p>
              <p><strong>Message:</strong></p>
              <p>{selectedInquiry.message}</p>
              <p><strong>Date:</strong> {new Date(selectedInquiry.created_at).toLocaleString()}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedInquiry(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageInquiries;
