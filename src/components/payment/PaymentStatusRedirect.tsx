import { useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { getPaymentRedirectPath } from '@/lib/paymentCallbackParams';

/**
 * Paymob returns to `/?paymentStatus=SUCCESS|...` — send the user to the right result page.
 */
const PaymentStatusRedirect = () => {
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (pathname.startsWith('/payment/')) return;

    const target = getPaymentRedirectPath(searchParams);
    if (target) {
      navigate(target, { replace: true });
    }
  }, [pathname, searchParams, navigate]);

  return null;
};

export default PaymentStatusRedirect;
