// api/test.js
export default function handler(request, response) {
  response.status(200).json({
    message: "Hello from Vercel!",
    status: "OK",
    timestamp: new Date().toISOString()
  });
}