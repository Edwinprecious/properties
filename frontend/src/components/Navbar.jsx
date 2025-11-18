import React, { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container, Button } from "react-bootstrap";
import "./Navbar.css"; 
import { Link } from "react-router-dom";

const RealEstateNavbar = () => {
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Navbar
      expand="lg"
      fixed="top"
      className={`custom-navbar py-2 ${scrolled ? "navbar-scrolled" : ""}`}
    >
      <Container>
        {/* Logo / Brand */}
        <Navbar.Brand
          href="/"
          className="fw-bold text-purple"
          style={{ fontSize: "1.4rem" }}
        >
          Valerie Classic Realty
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link href="/" className="mx-2 text-dark fw-medium">
              Home
            </Nav.Link>
            <Nav.Link href="/about" className="mx-2 text-dark fw-medium">
              About
            </Nav.Link>

            <NavDropdown title="Properties" className="mx-2 fw-medium">
              <NavDropdown.Item href="/properties/sale">For Sale</NavDropdown.Item>
              <NavDropdown.Item href="/properties/rent">For Rent</NavDropdown.Item>
              <NavDropdown.Item href="/properties/luxury">Luxury Homes</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/properties/new">Add New Listing</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Services" className="mx-2 fw-medium">
              <NavDropdown.Item href="/services/valuation">Property Valuation</NavDropdown.Item>
              <NavDropdown.Item href="/services/consultation">Consultation</NavDropdown.Item>
              <NavDropdown.Item href="/services/management">Property Management</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/contact" className="mx-2 text-dark fw-medium">
              Contact
            </Nav.Link>

            <Button
              href="/get-started"
              className="ms-2 btn-purple"
              as={Link} to={'/login'}
            >
              Get Started
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default RealEstateNavbar;
