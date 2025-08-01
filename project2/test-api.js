const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/v1';

async function testAPI() {
  console.log('🧪 Testing Order Management API...\n');

  try {
    console.log('1. Testing Health Check...');
    const health = await axios.get('http://localhost:3000/health');
    console.log('✅ Health check passed:', health.data.message);
    console.log('');

    console.log('2. Testing Create Order...');
    const createOrder = await axios.post(`${BASE_URL}/orders`, {
      produk_id: 1,
      nama_produk: 'Produk A'
    });
    console.log('✅ Order created:', createOrder.data.data);
    console.log('');

    console.log('3. Testing Get Order by ID...');
    const orderId = createOrder.data.data.id;
    const getOrder = await axios.get(`${BASE_URL}/orders/${orderId}`);
    console.log('✅ Order retrieved:', getOrder.data.data);
    console.log('');

    console.log('4. Testing Generate Test Orders...');
    const generateOrders = await axios.post(`${BASE_URL}/orders/generate-test?count=10`);
    console.log('✅ Test orders generated:', generateOrders.data.message);
    console.log('');

    console.log('5. Testing Get All Orders...');
    const allOrders = await axios.get(`${BASE_URL}/orders?page=1&limit=5`);
    console.log('✅ Orders retrieved:', allOrders.data.data.length, 'orders');
    console.log('');

    console.log('6. Testing Get Statistics...');
    const stats = await axios.get(`${BASE_URL}/orders/statistics`);
    console.log('✅ Statistics retrieved:', stats.data.data);
    console.log('');

    console.log('7. Testing Update Order Status...');
    const updateStatus = await axios.patch(`${BASE_URL}/orders/${orderId}/status`, {
      status: 'paid'
    });
    console.log('✅ Order status updated:', updateStatus.data.data.status);
    console.log('');

    console.log('8. Testing Get Orders by Status...');
    const pendingOrders = await axios.get(`${BASE_URL}/orders/status/pending?page=1&limit=5`);
    console.log('✅ Pending orders retrieved:', pendingOrders.data.data.length, 'orders');
    console.log('');

    console.log('🎉 All tests passed successfully!');
    console.log('📊 API is working correctly with all features.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('');
    console.log('💡 Make sure the server is running on port 3000');
    console.log('💡 Run: docker-compose up -d');
  }
}

testAPI(); 