import { apiClient } from '@/api/axios';
import type { UploadImageResponse, UploadImagesResponse } from '@/types/portfolio.types';

export const uploadService = {
  async uploadSingleImage(file: File): Promise<UploadImageResponse> {
    const formData = new FormData();
    formData.append('image', file);
    const response = await apiClient.post('/portfolio/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async uploadMultipleImages(files: File[]): Promise<UploadImagesResponse> {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const response = await apiClient.post('/portfolio/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  async deleteImage(filePath: string): Promise<{ message?: string }> {
    const response = await apiClient.delete('/portfolio/upload/image', {
      data: { filePath },
    });
    return response.data;
  },
};

