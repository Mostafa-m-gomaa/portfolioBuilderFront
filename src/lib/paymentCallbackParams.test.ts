import { describe, expect, it } from 'vitest';
import { getPaymentRedirectPath, isPaymentSuccessStatus } from './paymentCallbackParams';

describe('payment callback', () => {
  it('treats SUCCESS as success', () => {
    expect(isPaymentSuccessStatus('SUCCESS')).toBe(true);
    expect(isPaymentSuccessStatus('success')).toBe(true);
    expect(isPaymentSuccessStatus('FAILED')).toBe(false);
    expect(isPaymentSuccessStatus('CANCELLED')).toBe(false);
  });

  it('redirects gateway homepage callback to result routes', () => {
    const params = new URLSearchParams(
      'paymentStatus=SUCCESS&merchantOrderId=pkg_abc&orderId=68f88b30&transactionId=TX-1',
    );
    expect(getPaymentRedirectPath(params)).toBe(
      '/payment/success?merchantOrderId=pkg_abc&orderId=68f88b30&transactionId=TX-1',
    );

    const failed = new URLSearchParams('paymentStatus=FAILED&merchantOrderId=pkg_abc');
    expect(getPaymentRedirectPath(failed)).toBe('/payment/failure?merchantOrderId=pkg_abc');
  });

  it('returns null without paymentStatus', () => {
    expect(getPaymentRedirectPath(new URLSearchParams('foo=bar'))).toBeNull();
  });
});
