/**
 * Simple test script to verify backend connectivity and CORS configuration.
 * Run this in your browser console or using a tool like Node.js (v18+).
 */

const BACKEND_URL = 'https://learnsphere-backend-d6gb.onrender.com';

console.log(`🚀 Testing connection to: ${BACKEND_URL} ...`);

fetch(`${BACKEND_URL}/api/test`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ prompt: 'ping' })
})
  .then(res => {
    if (!res.ok) {
        console.error(`❌ HTTP Error: ${res.status} ${res.statusText}`);
        return res.text().then(text => { throw new Error(`Server returned ${res.status}: ${text}`) });
    }
    return res.json();
  })
  .then(data => {
    console.log('✅ Backend Status:', data);
    console.log('🎉 Connection successful! The API is responding and CORS is correctly configured.');
  })
  .catch(err => {
    console.error('❌ Connection Error:', err);
    
    if (err.message === 'Failed to fetch') {
        console.warn('💡 POSSIBLE CORS ISSUE: If the server is up but the browser blocked the request, check your backend CORS settings.');
        console.warn(`Ensure '${window.location.origin}' is allowed in the backend's CORSMiddleware origins list.`);
    } else {
        console.log('💡 Note: Render services often sleep after 15 mins of inactivity. It may take 30-60 seconds for the first request to succeed.');
    }
  });
