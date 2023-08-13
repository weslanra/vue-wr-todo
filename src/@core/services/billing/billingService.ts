import AuthService from "@core/services/auth/authService";
import {
  IBillingConfig,
} from "@core/services/interfaces/billing/IBillingService";
import { AxiosInstance } from "axios";
import defaultConfig from "./billingDefaultConfig";

export default class BillingService
  extends AuthService
  implements IBillingConfig
{
  serviceBillingConfig: IBillingConfig;

  constructor(axiosIns: AxiosInstance, overrideConfig: Object) {
    super(axiosIns, overrideConfig);
    this.serviceBillingConfig = { ...defaultConfig, ...overrideConfig };
  }
}