import { apiClient } from '@/api/axios';
import type {
  Portfolio,
  SectionItem,
  SectionItemPayload,
  SectionUpsertPayload,
} from '@/types/portfolio.types';

export const portfolioService = {
  async createPortfolio(): Promise<Portfolio> {
    const response = await apiClient.post('/portfolio');
    return response.data?.portfolio ?? response.data;
  },

  async getMyPortfolio(): Promise<Portfolio> {
    const response = await apiClient.get('/portfolio/me');
    return response.data?.portfolio ?? response.data;
  },

  async getAllSections(): Promise<Record<string, unknown>> {
    const response = await apiClient.get('/portfolio/sections/all');
    return response.data?.sections ?? response.data;
  },

  async getSection(section: string): Promise<Record<string, unknown>> {
    const response = await apiClient.get(`/portfolio/section/${section}`);
    return response.data?.section ?? response.data;
  },

  async upsertSection(section: string, payload: SectionUpsertPayload): Promise<Record<string, unknown>> {
    const response = await apiClient.put(`/portfolio/section/${section}`, payload);
    return response.data;
  },

  async clearSection(section: string): Promise<{ message?: string }> {
    const response = await apiClient.delete(`/portfolio/section/${section}`);
    return response.data;
  },

  async getSectionItems(section: string): Promise<SectionItem[]> {
    const response = await apiClient.get(`/portfolio/section/${section}/items`);
    return response.data?.items ?? response.data ?? [];
  },

  async createSectionItem(section: string, payload: SectionItemPayload): Promise<Record<string, unknown>> {
    const response = await apiClient.post(`/portfolio/section/${section}/items`, payload);
    return response.data;
  },

  async updateSectionItem(section: string, itemId: string, payload: SectionItemPayload): Promise<Record<string, unknown>> {
    const response = await apiClient.put(`/portfolio/section/${section}/items/${itemId}`, payload);
    return response.data;
  },

  async deleteSectionItem(section: string, itemId: string): Promise<{ message?: string }> {
    const response = await apiClient.delete(`/portfolio/section/${section}/items/${itemId}`);
    return response.data;
  },

  async setSectionActive(section: string, active: boolean): Promise<Record<string, unknown>> {
    const response = await apiClient.patch(`/portfolio/section/${section}/active`, { active });
    return response.data;
  },

  async updateLanguageMode(languageMode: 'ar' | 'en' | 'both'): Promise<{ message?: string; languageMode?: string }> {
    const response = await apiClient.patch('/portfolio/language', { languageMode });
    return response.data;
  },

  async publishPortfolio(): Promise<{ message?: string }> {
    const response = await apiClient.post('/portfolio/publish');
    return response.data;
  },

  async unpublishPortfolio(): Promise<{ message?: string }> {
    const response = await apiClient.post('/portfolio/unpublish');
    return response.data;
  },
};

