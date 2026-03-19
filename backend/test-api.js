import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('=== Testing SetiaKawan Gym API ===\n');

  // Test health endpoint
  try {
    const healthRes = await axios.get(`${API_URL}/health`);
    console.log('✓ Health check:', healthRes.data);
  } catch (error) {
    console.log('✗ Health check failed:', error.message);
    return;
  }

  // Test login
  console.log('\n--- Testing Authentication ---');
  let adminToken = '';
  try {
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@setiakawan.com',
      password: 'admin123'
    });
    console.log('✓ Admin login successful');
    console.log('  User:', loginRes.data.user.name);
    console.log('  Role:', loginRes.data.user.role);
    adminToken = loginRes.data.token;
  } catch (error) {
    console.log('✗ Admin login failed:', error.response?.data?.message || error.message);
  }

  // Test member login
  try {
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'member@setiakawan.com',
      password: 'member123'
    });
    console.log('✓ Member login successful');
    console.log('  User:', loginRes.data.user.name);
  } catch (error) {
    console.log('✗ Member login failed:', error.response?.data?.message || error.message);
  }

  // Test get classes
  console.log('\n--- Testing Classes API ---');
  try {
    const classesRes = await axios.get(`${API_URL}/classes`);
    console.log(`✓ Retrieved ${classesRes.data.classes.length} classes`);
    classesRes.data.classes.forEach(c => {
      console.log(`  - ${c.name} with ${c.instructor}`);
    });
  } catch (error) {
    console.log('✗ Get classes failed:', error.message);
  }

  // Test get testimonials
  console.log('\n--- Testing Testimonials API ---');
  try {
    const testimonialsRes = await axios.get(`${API_URL}/testimonials`);
    console.log(`✓ Retrieved ${testimonialsRes.data.testimonials.length} testimonials`);
  } catch (error) {
    console.log('✗ Get testimonials failed:', error.message);
  }

  // Test booking (with auth)
  if (adminToken) {
    console.log('\n--- Testing Bookings API (with auth) ---');
    try {
      const bookingsRes = await axios.get(`${API_URL}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✓ Retrieved ${bookingsRes.data.bookings.length} bookings`);
    } catch (error) {
      console.log('✗ Get bookings failed:', error.response?.data?.message || error.message);
    }

    // Test get members (admin only)
    console.log('\n--- Testing Admin API ---');
    try {
      const membersRes = await axios.get(`${API_URL}/auth/members`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      console.log(`✓ Retrieved ${membersRes.data.members.length} members`);
    } catch (error) {
      console.log('✗ Get members failed:', error.response?.data?.message || error.message);
    }
  }

  console.log('\n=== API Tests Complete ===');
}

testAPI().catch(console.error);
