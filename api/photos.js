const { createPhotosClient, formatPhotoUrl } = require('../lib/google-client');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { albumId, pageSize = 50, pageToken } = req.query;
    
    if (!albumId) {
      return res.status(400).json({ error: 'albumId is required' });
    }

    const photoslibrary = createPhotosClient();

    // Ищем медиа в конкретном альбоме
    const response = await photoslibrary.mediaItems.search({
      requestBody: {
        albumId: albumId,
        pageSize: parseInt(pageSize),
        pageToken: pageToken || undefined
      }
    });

    const photos = response.data.mediaItems?.map(item => ({
      id: item.id,
      title: item.filename,
      description: item.description,
      mimeType: item.mimeType,
      // Ссылки на разные размеры
      thumbnail: formatPhotoUrl(item.baseUrl, 300, 300),
      medium: formatPhotoUrl(item.baseUrl, 800, 600),
      large: formatPhotoUrl(item.baseUrl, 1600, 1200),
      original: `${item.baseUrl}=d`, // оригинал
      // Метаданные
      metadata: {
        width: item.mediaMetadata?.width,
        height: item.mediaMetadata?.height,
        creationTime: item.mediaMetadata?.creationTime
      }
    })) || [];

    const result = {
      photos,
      nextPageToken: response.data.nextPageToken,
      total: photos.length
    };

    // Кэшируем на 30 минут
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate');
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ 
      error: 'Failed to fetch photos',
      details: error.message 
    });
  }
};