const { io } = require('socket.io-client');

const buyerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJidXllckBnbWFpbC5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTc1MzAzMDk1OSwiZXhwIjoxNzUzMDMxODU5fQ.U-AWNFCv40rmaylRLADjLEP-F3_l4QjBfB658_VmlvU'; // Replace with buyer accessToken
const sellerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwiZW1haWwiOiJzZWxsZXJAZ21haWwuY29tIiwicm9sZSI6IlNFTExFUiIsImlhdCI6MTc1MzAzMTAwNCwiZXhwIjoxNzUzMDMxOTA0fQ.qPQAJ2A6F5_yMpORjf2YAH9u7zBndMHKLorvXiVlZiE'; // Replace with seller accessToken

const buyerSocket = io('http://localhost:5000', { auth: { token: `Bearer ${buyerToken}` } });
const sellerSocket = io('http://localhost:5000', { auth: { token: `Bearer ${sellerToken}` } });

buyerSocket.on('connect', () => {
  console.log('Buyer connected');
  buyerSocket.emit('sendMessage', { receiverId: 2, content: 'Hello from buyer' });
  buyerSocket.emit('typing', { receiverId: 2 });
});

sellerSocket.on('connect', () => {
  console.log('Seller connected');
});

sellerSocket.on('receiveMessage', (message) => {
  console.log('Seller received:', message);
});

sellerSocket.on('typing', ({ senderId }) => {
  console.log(`User ${senderId} is typing`);
});