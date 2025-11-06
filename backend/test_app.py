import pytest
import json
from app import app, get_db_connection

@pytest.fixture
def client():
    """Create a test client for the Flask app"""
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def auth_token(client):
    """Get authentication token for testing protected routes"""
    # Create a unique test user
    import time
    email = f'testuser{int(time.time())}@example.com'
    
    client.post('/api/signup',
        data=json.dumps({
            'name': 'Test User',
            'email': email,
            'phone': '1234567890',
            'password': 'testpassword',
            'confirm_password': 'testpassword',
            'role': 'user'
        }),
        content_type='application/json'
    )
    
    # Login
    response = client.post('/api/login',
        data=json.dumps({
            'email': email,
            'password': 'testpassword'
        }),
        content_type='application/json'
    )
    data = json.loads(response.data)
    return data.get('access_token')


@pytest.fixture
def admin_token(client):
    """Get admin token for testing admin routes"""
    # Create admin user
    import time
    email = f'admin{int(time.time())}@example.com'
    
    # First signup
    client.post('/api/signup',
        data=json.dumps({
            'name': 'Admin User',
            'email': email,
            'phone': '1234567890',
            'password': 'adminpass',
            'confirm_password': 'adminpass',
            'role': 'admin'
        }),
        content_type='application/json'
    )
    
    # Then update role to admin in database
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE valerie SET role = 'admin' WHERE email = %s", (email,))
    conn.commit()
    cursor.close()
    conn.close()
    
    # Login as admin
    response = client.post('/api/login',
        data=json.dumps({
            'email': email,
            'password': 'adminpass'
        }),
        content_type='application/json'
    )
    data = json.loads(response.data)
    return data.get('access_token')


# ========================================
# TEST PUBLIC ROUTES
# ========================================

def test_get_all_properties(client):
    """Test fetching all properties"""
    response = client.get('/api/properties')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'data' in data
    print("✅ GET /api/properties - PASSED")


def test_get_properties_by_category(client):
    """Test filtering properties by category"""
    response = client.get('/api/properties?category=rent')
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'data' in data
    print("✅ GET /api/properties?category=rent - PASSED")


def test_get_single_property(client):
    """Test fetching a single property by ID"""
    response = client.get('/api/properties/1')
    
    # Could be 200 (found) or 404 (not found)
    assert response.status_code in [200, 404]
    print("✅ GET /api/properties/1 - PASSED")


def test_get_property_by_slug(client):
    """Test fetching property by slug"""
    response = client.get('/api/properties/slug/test-property')
    
    assert response.status_code in [200, 404]
    print("✅ GET /api/properties/slug/:slug - PASSED")


def test_signup(client):
    """Test user signup"""
    import time
    email = f'newsignup{int(time.time())}@example.com'
    
    response = client.post('/api/signup',
        data=json.dumps({
            'name': 'New User',
            'email': email,
            'phone': '0987654321',
            'password': 'newpass123',
            'confirm_password': 'newpass123',
            'role': 'user'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['status'] == 'success'
    print("✅ POST /api/signup - PASSED")


def test_login(client):
    """Test user login"""
    import time
    email = f'logintest{int(time.time())}@example.com'
    
    # First create user
    client.post('/api/signup',
        data=json.dumps({
            'name': 'Login Test',
            'email': email,
            'phone': '1234567890',
            'password': 'testpass123',
            'confirm_password': 'testpass123'
        }),
        content_type='application/json'
    )
    
    # Now try to login
    response = client.post('/api/login',
        data=json.dumps({
            'email': email,
            'password': 'testpass123'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data
    assert data['success'] == True
    print("✅ POST /api/login - PASSED")


def test_login_invalid_credentials(client):
    """Test login with wrong password"""
    response = client.post('/api/login',
        data=json.dumps({
            'email': 'nonexistent@example.com',
            'password': 'wrongpassword'
        }),
        content_type='application/json'
    )
    
    # ✅ Should return 401 for invalid credentials
    assert response.status_code == 401
    data = json.loads(response.data)
    assert 'error' in data
    print("✅ POST /api/login (invalid credentials) - PASSED")


# ========================================
# TEST PROTECTED ROUTES (USER)
# ========================================

def test_add_favorite_without_auth(client):
    """Test that favorites endpoint requires authentication"""
    response = client.post('/api/favorites',
        data=json.dumps({'property_id': 1}),
        content_type='application/json'
    )
    
    assert response.status_code == 401  # Unauthorized
    print("✅ POST /api/favorites (no auth) - PASSED")


def test_add_favorite_with_auth(client, auth_token):
    """Test adding property to favorites"""
    if not auth_token:
        pytest.skip("Auth token not available")
    
    response = client.post('/api/favorites',
        data=json.dumps({'property_id': 1}),
        headers={'Authorization': f'Bearer {auth_token}'},
        content_type='application/json'
    )
    
    # Could be 201 (created) or 200 (already exists) or 404 (property not found)
    assert response.status_code in [200, 201, 404]
    print("✅ POST /api/favorites (with auth) - PASSED")


def test_get_user_favorites(client, auth_token):
    """Test getting user's favorites"""
    if not auth_token:
        pytest.skip("Auth token not available")
    
    response = client.get('/api/favorites',
        headers={'Authorization': f'Bearer {auth_token}'}
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'data' in data
    print("✅ GET /api/favorites - PASSED")


def test_create_inquiry(client, auth_token):
    """Test creating an inquiry"""
    if not auth_token:
        pytest.skip("Auth token not available")
    
    response = client.post('/api/inquiries',
        data=json.dumps({
            'property_id': 1,
            'message': 'Test inquiry message',
            'user_name': 'Test User',
            'user_email': 'test@example.com',
            'user_phone': '1234567890'
        }),
        headers={'Authorization': f'Bearer {auth_token}'},
        content_type='application/json'
    )
    
    # Could be 201 (created) or 404 (property not found)
    assert response.status_code in [201, 404]
    print("✅ POST /api/inquiries - PASSED")


# ========================================
# TEST ADMIN ROUTES
# ========================================

def test_create_property_without_admin(client, auth_token):
    """Test that only admins can create properties"""
    if not auth_token:
        pytest.skip("Auth token not available")
    
    response = client.post('/api/admin/properties',
        data=json.dumps({
            'title': 'Test Property',
            'price': 100000,
            'location': 'Lagos',
            'category': 'rent'
        }),
        headers={'Authorization': f'Bearer {auth_token}'},
        content_type='application/json'
    )
    
    # Should be 403 if user is not admin
    assert response.status_code == 403
    print("✅ POST /api/admin/properties (non-admin) - PASSED")


def test_get_dashboard_stats_without_admin(client, auth_token):
    """Test that only admins can access dashboard"""
    if not auth_token:
        pytest.skip("Auth token not available")
    
    response = client.get('/api/admin/dashboard/stats',
        headers={'Authorization': f'Bearer {auth_token}'}
    )
    
    assert response.status_code == 403
    print("✅ GET /api/admin/dashboard/stats (non-admin) - PASSED")


# ========================================
# TEST PASSWORD RESET
# ========================================

def test_forgot_password(client):
    """Test forgot password request"""
    response = client.post('/api/forgot-password',
        data=json.dumps({
            'email': 'test@example.com'
        }),
        content_type='application/json'
    )
    
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['status'] == 'success'
    print("✅ POST /api/forgot-password - PASSED")


def test_verify_invalid_token(client):
    """Test verifying an invalid reset token"""
    response = client.get('/api/verify-reset-token/invalid-token-12345')
    
    assert response.status_code == 400
    data = json.loads(response.data)
    assert data['valid'] == False
    print("✅ GET /api/verify-reset-token (invalid) - PASSED")


if __name__ == '__main__':
    pytest.main([__file__, '-v', '-s'])