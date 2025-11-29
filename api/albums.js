const { createPhotosClient, formatPhotoUrl } = require('../lib/google-client');

module.exports = async (req, res) => {
  // Настраиваем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const photoslibrary = createPhotosClient();
    
    // Получаем список альбомов
    const response = await photoslibrary.albums.list({
      pageSize: 50
    });

    const albums = response.data.albums?.map(album => ({
      id: album.id,
      title: album.title,
      productUrl: album.productUrl,
      mediaItemsCount: album.mediaItemsCount,
      coverPhoto: album.coverPhotoBaseUrl ? 
        formatPhotoUrl(album.coverPhotoBaseUrl, 300, 300) : null
    })) || [];

    // Кэшируем на 1 час
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ albums });
    
  } catch (error) {
    console.error('Error fetching albums:', error);
    res.status(500).json({ 
      error: 'Failed to fetch albums',
      details: error.message 
    });
  }
};