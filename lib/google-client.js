const { google } = require('googleapis');

// Создаем клиент для Google Photos API
function createPhotosClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ['https://www.googleapis.com/auth/photoslibrary.readonly']
  });

  return google.photoslibrary({ version: 'v1', auth });
}

// Форматируем URL фото с нужным размером
function formatPhotoUrl(baseUrl, width = 800, height = 600) {
  return `${baseUrl}=w${width}-h${height}-c`;
}

module.exports = {
  createPhotosClient,
  formatPhotoUrl
};