import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseApiError } from '@/api/axios';
import { portfolioService } from '@/services/portfolio.service';
import { uploadService } from '@/services/upload.service';
import { usePortfolioStore } from '@/store/portfolio.store';

const portfolioKeys = {
  me: ['portfolio', 'me'] as const,
  sections: ['portfolio', 'sections', 'all'] as const,
  section: (section: string) => ['portfolio', 'section', section] as const,
  items: (section: string) => ['portfolio', 'section', section, 'items'] as const,
};

export const usePortfolioBootstrap = () => {
  const queryClient = useQueryClient();
  const { setPortfolio } = usePortfolioStore();

  return useMutation({
    mutationFn: async () => {
      try {
        return await portfolioService.getMyPortfolio();
      } catch {
        await portfolioService.createPortfolio();
        return portfolioService.getMyPortfolio();
      }
    },
    onSuccess: (portfolio) => {
      setPortfolio(portfolio);
      queryClient.setQueryData(portfolioKeys.me, portfolio);
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to initialize portfolio')),
  });
};

export const useMyPortfolio = () => {
  const { setPortfolio } = usePortfolioStore();
  return useQuery({
    queryKey: portfolioKeys.me,
    queryFn: async () => {
      const data = await portfolioService.getMyPortfolio();
      setPortfolio(data);
      return data;
    },
  });
};

export const useAllSections = () =>
  useQuery({
    queryKey: portfolioKeys.sections,
    queryFn: portfolioService.getAllSections,
  });

export const useSection = (section: string) =>
  useQuery({
    queryKey: portfolioKeys.section(section),
    queryFn: () => portfolioService.getSection(section),
    enabled: Boolean(section),
  });

export const useSectionItems = (section: string) =>
  useQuery({
    queryKey: portfolioKeys.items(section),
    queryFn: () => portfolioService.getSectionItems(section),
    enabled: Boolean(section),
  });

export const usePortfolioActions = (section?: string) => {
  const queryClient = useQueryClient();

  const refreshSection = async (sectionName: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: portfolioKeys.section(sectionName) }),
      queryClient.invalidateQueries({ queryKey: portfolioKeys.items(sectionName) }),
      queryClient.invalidateQueries({ queryKey: portfolioKeys.me }),
      queryClient.invalidateQueries({ queryKey: portfolioKeys.sections }),
    ]);
  };

  const upsertSectionMutation = useMutation({
    mutationFn: ({ sectionName, payload }: { sectionName: string; payload: Record<string, unknown> }) =>
      portfolioService.upsertSection(sectionName, payload),
    onSuccess: async (_data, variables) => {
      await refreshSection(variables.sectionName);
      toast.success('Section saved.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to save section')),
  });

  const clearSectionMutation = useMutation({
    mutationFn: (sectionName: string) => portfolioService.clearSection(sectionName),
    onSuccess: async (_data, sectionName) => {
      await refreshSection(sectionName);
      toast.success('Section cleared.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to clear section')),
  });

  const createItemMutation = useMutation({
    mutationFn: ({ sectionName, payload }: { sectionName: string; payload: Record<string, unknown> }) =>
      portfolioService.createSectionItem(sectionName, payload),
    onSuccess: async (_data, variables) => {
      await refreshSection(variables.sectionName);
      toast.success('Item created.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to create item')),
  });

  const updateItemMutation = useMutation({
    mutationFn: ({
      sectionName,
      itemId,
      payload,
    }: {
      sectionName: string;
      itemId: string;
      payload: Record<string, unknown>;
    }) => portfolioService.updateSectionItem(sectionName, itemId, payload),
    onSuccess: async (_data, variables) => {
      await refreshSection(variables.sectionName);
      toast.success('Item updated.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to update item')),
  });

  const deleteItemMutation = useMutation({
    mutationFn: ({ sectionName, itemId }: { sectionName: string; itemId: string }) =>
      portfolioService.deleteSectionItem(sectionName, itemId),
    onSuccess: async (_data, variables) => {
      await refreshSection(variables.sectionName);
      toast.success('Item deleted.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to delete item')),
  });

  const setSectionActiveMutation = useMutation({
    mutationFn: ({ sectionName, active }: { sectionName: string; active: boolean }) =>
      portfolioService.setSectionActive(sectionName, active),
    onSuccess: async (_data, variables) => {
      await refreshSection(variables.sectionName);
      toast.success(`Section is now ${variables.active ? 'open' : 'closed'}.`);
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to update section active state')),
  });

  const updateLanguageModeMutation = useMutation({
    mutationFn: (languageMode: 'ar' | 'en' | 'both') => portfolioService.updateLanguageMode(languageMode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.me });
      toast.success('Language mode updated.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to update language mode')),
  });

  const publishMutation = useMutation({
    mutationFn: portfolioService.publishPortfolio,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.me });
      toast.success('Portfolio published.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to publish portfolio')),
  });

  const unpublishMutation = useMutation({
    mutationFn: portfolioService.unpublishPortfolio,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.me });
      toast.success('Portfolio unpublished.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to unpublish portfolio')),
  });

  const uploadSingleMutation = useMutation({
    mutationFn: (file: File) => uploadService.uploadSingleImage(file),
    onSuccess: async () => {
      if (section) await refreshSection(section);
      toast.success('Image uploaded.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to upload image')),
  });

  const uploadMultipleMutation = useMutation({
    mutationFn: (files: File[]) => uploadService.uploadMultipleImages(files),
    onSuccess: async () => {
      if (section) await refreshSection(section);
      toast.success('Images uploaded.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to upload images')),
  });

  const deleteUploadedImageMutation = useMutation({
    mutationFn: (filePath: string) => uploadService.deleteImage(filePath),
    onSuccess: async () => {
      if (section) await refreshSection(section);
      toast.success('Image deleted.');
    },
    onError: (error) => toast.error(parseApiError(error, 'Failed to delete image')),
  });

  return {
    upsertSectionMutation,
    clearSectionMutation,
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
    setSectionActiveMutation,
    updateLanguageModeMutation,
    publishMutation,
    unpublishMutation,
    uploadSingleMutation,
    uploadMultipleMutation,
    deleteUploadedImageMutation,
  };
};

