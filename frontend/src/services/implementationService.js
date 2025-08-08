import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://alldesignkhv.store/api';

export const implementationService = {
  getAllImplementations: async () => {
    try {
      const response = await axios.get(`${API_URL}/implementations/`);
      
      const processedData = response.data.map(item => {
        // Если main_image_url отсутствует, но есть main_image, и он не начинается с http
        if (!item.main_image_url && item.main_image && typeof item.main_image === 'string' && !item.main_image.startsWith('http')) {
          item.main_image_url = `https://alldesignkhv.store${item.main_image}`;
        }
        return item;
      });
      
      return processedData;
    } catch (error) {
      console.error('Ошибка при получении списка реализаций:', error);
      throw error;
    }
  },

  getImplementationById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/implementations/${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении реализации с ID ${id}:`, error);
      throw error;
    }
  },

  getImplementationStages: async (implementationId) => {
    try {
      const response = await axios.get(`${API_URL}/implementation-stages/?implementation=${implementationId}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении этапов реализации ${implementationId}:`, error);
      throw error;
    }
  },

  getStageMedia: async (stageId) => {
    try {
      const response = await axios.get(`${API_URL}/implementation-media/?stage=${stageId}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении медиафайлов этапа ${stageId}:`, error);
      throw error;
    }
  },

  addStageMedia: async (stageId, mediaData) => {
    try {
      const formData = new FormData();
      formData.append('stage', stageId);
      formData.append('media_type', mediaData.type);
      formData.append('title', mediaData.title);
      formData.append('description', mediaData.description);
      formData.append('file', mediaData.file);
      if (mediaData.thumbnail) {
        formData.append('thumbnail', mediaData.thumbnail);
      }
      formData.append('order', mediaData.order || 0);

      const response = await axios.post(`${API_URL}/implementation-media/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Ошибка при добавлении медиафайла:', error);
      throw error;
    }
  },

  updateStageStatus: async (stageId, isCompleted) => {
    try {
      const response = await axios.patch(`${API_URL}/implementation-stages/${stageId}/`, {
        is_completed: isCompleted
      });
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении статуса этапа ${stageId}:`, error);
      throw error;
    }
  }
}; 