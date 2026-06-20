import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { parseApiError } from '@/api/axios';
import { portfolioService } from '@/services/portfolio.service';
import { uploadService } from '@/services/upload.service';
import { usePortfolioStore } from '@/store/portfolio.store';
import { useAuthStore } from '@/store/auth.store';
import type { AuthUser } from '@/types/auth.types';
import { tToast } from '@/lib/i18n';

const syncAuthFromMePatch = (authPatch: Partial<AuthUser> | null) => {
  if (!authPatch) return;
  const { user, setAuth } = useAuthStore.getState();
  if (!user) return;
  setAuth({ user: { ...user, ...authPatch } });
};

const loadMyPortfolio = async () => {
  const { portfolio, authPatch } = await portfolioService.getMyPortfolioWithAuth();
  syncAuthFromMePatch(authPatch);
  return portfolio;
};

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
        return await loadMyPortfolio();
      } catch {
        await portfolioService.createPortfolio();
        return loadMyPortfolio();
      }
    },
    onSuccess: (portfolio) => {
      setPortfolio(portfolio);
      queryClient.setQueryData(portfolioKeys.me, portfolio);
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.initError'))),
  });
};

export const useMyPortfolio = (enabled = true) => {
  const { setPortfolio } = usePortfolioStore();
  return useQuery({
    queryKey: portfolioKeys.me,
    queryFn: async () => {
      const data = await loadMyPortfolio();
      setPortfolio(data);
      return data;
    },
    enabled,
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
      toast.success(tToast('toast.portfolio.sectionSaved'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.sectionSaveError'))),
  });

  const clearSectionMutation = useMutation({
    mutationFn: (sectionName: string) => portfolioService.clearSection(sectionName),
    onSuccess: async (_data, sectionName) => {
      await refreshSection(sectionName);
      toast.success(tToast('toast.portfolio.sectionCleared'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.sectionClearError'))),
  });

  const createItemMutation = useMutation({
    mutationFn: ({ sectionName, payload }: { sectionName: string; payload: Record<string, unknown> }) =>
      portfolioService.createSectionItem(sectionName, payload),
    onSuccess: async (_data, variables) => {
      await refreshSection(variables.sectionName);
      toast.success(tToast('toast.portfolio.itemCreated'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.itemCreateError'))),
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
      toast.success(tToast('toast.portfolio.itemUpdated'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.itemUpdateError'))),
  });

  const deleteItemMutation = useMutation({
    mutationFn: ({ sectionName, itemId }: { sectionName: string; itemId: string }) =>
      portfolioService.deleteSectionItem(sectionName, itemId),
    onSuccess: async (_data, variables) => {
      await refreshSection(variables.sectionName);
      toast.success(tToast('toast.portfolio.itemDeleted'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.itemDeleteError'))),
  });

  const setSectionActiveMutation = useMutation({
    mutationFn: ({ sectionName, active }: { sectionName: string; active: boolean }) =>
      portfolioService.setSectionActive(sectionName, active),
    onSuccess: async (_data, variables) => {
      await refreshSection(variables.sectionName);
      toast.success(
        tToast(variables.active ? 'toast.portfolio.sectionOpen' : 'toast.portfolio.sectionClosed'),
      );
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.sectionActiveError'))),
  });

  const updateLanguageModeMutation = useMutation({
    mutationFn: (languageMode: 'ar' | 'en' | 'both') => portfolioService.updateLanguageMode(languageMode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.me });
      toast.success(tToast('toast.portfolio.languageModeUpdated'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.languageModeError'))),
  });

  const updateDefaultLanguageMutation = useMutation({
    mutationFn: (defaultLanguage: 'ar' | 'en') => portfolioService.updateDefaultLanguage(defaultLanguage),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.me });
      toast.success(tToast('toast.portfolio.defaultLanguageUpdated'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.defaultLanguageError'))),
  });

  const publishMutation = useMutation({
    mutationFn: portfolioService.publishPortfolio,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.me });
      toast.success(tToast('toast.portfolio.published'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.publishError'))),
  });

  const unpublishMutation = useMutation({
    mutationFn: portfolioService.unpublishPortfolio,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: portfolioKeys.me });
      toast.success(tToast('toast.portfolio.unpublished'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.unpublishError'))),
  });

  const uploadSingleMutation = useMutation({
    mutationFn: (file: File) => uploadService.uploadSingleImage(file),
    onSuccess: async () => {
      if (section) await refreshSection(section);
      toast.success(tToast('toast.portfolio.imageUploaded'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.imageUploadError'))),
  });

  const uploadMultipleMutation = useMutation({
    mutationFn: (files: File[]) => uploadService.uploadMultipleImages(files),
    onSuccess: async () => {
      if (section) await refreshSection(section);
      toast.success(tToast('toast.portfolio.imagesUploaded'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.imagesUploadError'))),
  });

  const deleteUploadedImageMutation = useMutation({
    mutationFn: (filePath: string) => uploadService.deleteImage(filePath),
    onSuccess: async () => {
      if (section) await refreshSection(section);
      toast.success(tToast('toast.portfolio.imageDeleted'));
    },
    onError: (error) => toast.error(parseApiError(error, tToast('toast.portfolio.imageDeleteError'))),
  });

  return {
    upsertSectionMutation,
    clearSectionMutation,
    createItemMutation,
    updateItemMutation,
    deleteItemMutation,
    setSectionActiveMutation,
    updateLanguageModeMutation,
    updateDefaultLanguageMutation,
    publishMutation,
    unpublishMutation,
    uploadSingleMutation,
    uploadMultipleMutation,
    deleteUploadedImageMutation,
  };
};

