import { AxiosInstance } from 'axios';
import BillingService from './billingService';

export default function useBilling( axiosIns: AxiosInstance, overrideConfig: Object ) {
  const billing = new BillingService( axiosIns, overrideConfig );

  return {
    billing,
  }
}