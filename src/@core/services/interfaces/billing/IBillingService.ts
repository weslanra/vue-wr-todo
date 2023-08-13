import { IAuthService } from "@core/services/interfaces/auth/IAuthService";

export interface IBillingService extends IAuthService {
  serviceBillingConfig: IBillingConfig;
}

export type IBillingConfig = {
};