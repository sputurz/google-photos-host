const { createPhotosClient } = require('../lib/google-client');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const photoslibrary = createPhotosClient();
    
    // Простой запрос для проверки аутентификации
    const response = await photoslibrary.albums.list({ pageSize: 1 });
    
    res.status(200).json({ 
      status: 'OK',
      message: 'Authentication successful',
      albumsCount: response.data.albums?.length || 0
    });
    
  } catch (error) {
    console.error('Auth test failed:', error);
    res.status(500).json({ 
      status: 'ERROR',
      error: 'Authentication failed',
      details: error.message 
    });
  }
};