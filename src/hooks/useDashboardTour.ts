import { useCallback, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { driver, type DriveStep, type Driver, type DriverHook } from 'driver.js';
import { toast } from 'sonner';
import { parseApiError } from '@/api/axios';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { useLanguage } from '@/contexts/LanguageContext';

type SetSearchParams = (
  params: { tab: string },
  options?: { replace?: boolean },
) => void;

type UseDashboardTourOptions = {
  setSearchParams: SetSearchParams;
  usesCustomDomain: boolean;
  siteEditorUrl: string | null | undefined;
  portfolioLoading: boolean;
  enabled?: boolean;
};

const refreshTourPosition = (driverInstance?: Driver) => {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      driverInstance?.refresh();
    });
  });
};

const createTabStepHandlers = (
  tab: string,
  setSearchParams: SetSearchParams,
): Pick<DriveStep, 'onHighlightStarted' | 'onHighlighted'> => ({
  onHighlightStarted: (_element, _step, { driver: driverInstance }) => {
    setSearchParams({ tab }, { replace: true });
    refreshTourPosition(driverInstance);
  },
  onHighlighted: (_element, _step, { driver: driverInstance }) => {
    refreshTourPosition(driverInstance);
  },
});

export const useDashboardTour = ({
  setSearchParams,
  usesCustomDomain,
  siteEditorUrl,
  portfolioLoading,
  enabled = true,
}: UseDashboardTourOptions) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t, dir } = useLanguage();

  const tourStartedRef = useRef(false);
  const completedRef = useRef(false);
  const driverRef = useRef<Driver | null>(null);

  const needsSync = isAuthenticated && user?.takeTour === undefined;

  const tourSyncQuery = useQuery({
    queryKey: ['auth', 'tour'],
    queryFn: () => authService.getTourStatus(),
    enabled: needsSync && enabled,
    staleTime: Infinity,
    retry: 1,
  });

  useEffect(() => {
    if (tourSyncQuery.data?.takeTour === undefined || !user || user.takeTour !== undefined) {
      return;
    }

    setAuth({ user: { ...user, takeTour: tourSyncQuery.data.takeTour } });
  }, [tourSyncQuery.data?.takeTour, user, setAuth]);

  const completeTourMutation = useMutation({
    mutationFn: () => authService.updateTour({ takeTour: true }),
    onSuccess: (data) => {
      const currentUser = useAuthStore.getState().user;
      if (data.user) {
        setAuth({ user: data.user, token: data.token });
        return;
      }
      if (currentUser) {
        setAuth({ user: { ...currentUser, takeTour: true } });
      }
    },
    onError: (error) => {
      completedRef.current = false;
      toast.error(parseApiError(error, t('dashboard.tour.completeError')));
    },
  });

  const markTourComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    completeTourMutation.mutate();
  }, [completeTourMutation]);

  const shouldShowTour = user?.takeTour === false;
  const syncReady = !needsSync || tourSyncQuery.isFetched;

  useEffect(() => {
    if (!enabled || !syncReady || portfolioLoading || !shouldShowTour || tourStartedRef.current) {
      return;
    }

    const timeout = window.setTimeout(() => {
      if (tourStartedRef.current) return;

      const steps: DriveStep[] = [
        {
          element: '[data-tour="view-site"]',
          popover: {
            title: t('dashboard.tour.viewSite.title'),
            description: t('dashboard.tour.viewSite.description'),
            side: 'bottom',
            align: 'start',
          },
        },
      ];

      if (siteEditorUrl) {
        steps.push({
          element: '[data-tour="edit-site"]',
          popover: {
            title: t('dashboard.tour.editSite.title'),
            description: t('dashboard.tour.editSite.description'),
            side: 'bottom',
            align: 'start',
          },
        });
      }

      if (!usesCustomDomain) {
        steps.push({
          element: '[data-tour="tab-domain"]',
          ...createTabStepHandlers('domain', setSearchParams),
          popover: {
            title: t('dashboard.tour.tabSubdomain.title'),
            description: t('dashboard.tour.tabSubdomain.description'),
            side: 'bottom',
            align: 'start',
          },
        });
      }

      steps.push(
        {
          element: '[data-tour="tab-add-domain"]',
          ...createTabStepHandlers('add-domain', setSearchParams),
          popover: {
            title: t('dashboard.tour.tabAddDomain.title'),
            description: t('dashboard.tour.tabAddDomain.description'),
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-tour="tab-logo"]',
          ...createTabStepHandlers('logo', setSearchParams),
          popover: {
            title: t('dashboard.tour.tabLogo.title'),
            description: t('dashboard.tour.tabLogo.description'),
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-tour="tab-template"]',
          ...createTabStepHandlers('template', setSearchParams),
          popover: {
            title: t('dashboard.tour.tabTemplate.title'),
            description: t('dashboard.tour.tabTemplate.description'),
            side: 'bottom',
            align: 'start',
          },
        },
        {
          element: '[data-tour="tab-settings"]',
          ...createTabStepHandlers('settings', setSearchParams),
          popover: {
            title: t('dashboard.tour.tabSettings.title'),
            description: t('dashboard.tour.tabSettings.description'),
            side: 'bottom',
            align: 'start',
          },
        },
      );

      tourStartedRef.current = true;

      const noopOverlayClick: DriverHook = () => {};

      const driverObj = driver({
        steps,
        animate: true,
        allowClose: true,
        disableActiveInteraction: true,
        overlayClickBehavior: noopOverlayClick,
        overlayOpacity: 0.72,
        stagePadding: 8,
        stageRadius: 12,
        popoverOffset: 14,
        showProgress: true,
        showButtons: ['previous', 'next', 'close'],
        progressText: t('dashboard.tour.progress'),
        nextBtnText: t('dashboard.tour.next'),
        prevBtnText: t('dashboard.tour.prev'),
        doneBtnText: t('dashboard.tour.finish'),
        popoverClass: `dashboard-tour-popover ${dir === 'rtl' ? 'dashboard-tour-popover--rtl' : ''}`,
        onCloseClick: (_element, _step, { driver: driverInstance }) => {
          driverInstance.destroy();
        },
        onPopoverRender: (popover, { driver: driverInstance }) => {
          const skipButton = popover.closeButton;
          skipButton.textContent = t('dashboard.tour.skip');
          skipButton.setAttribute('aria-label', t('dashboard.tour.skip'));
          skipButton.classList.add(
            'driver-popover-footer-btn',
            'driver-popover-skip-btn',
          );

          if (skipButton.parentElement !== popover.footerButtons) {
            popover.footerButtons.appendChild(skipButton);
          }

          skipButton.onclick = (event) => {
            event.preventDefault();
            event.stopPropagation();
            driverInstance.destroy();
          };
        },
        onDestroyed: () => {
          driverRef.current = null;
          markTourComplete();
        },
      });

      driverRef.current = driverObj;
      driverObj.drive();
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [
    enabled,
    syncReady,
    portfolioLoading,
    shouldShowTour,
    usesCustomDomain,
    siteEditorUrl,
    t,
    dir,
    setSearchParams,
    markTourComplete,
  ]);

  useEffect(() => {
    return () => {
      if (driverRef.current?.isActive()) {
        driverRef.current.destroy();
      }
    };
  }, []);
};
