import { AxiosInstance } from "axios";

export interface IAuthService {
  axiosIns: AxiosInstance;
  serviceConfig: IAuthConfig;
  isAlreadyFetchingAccessToken: boolean;
  subscribers: Array<Function>;

  onAccessTokenFetched(accessToken: string): void;
  addSubscriber(callback: Function): void;
  getToken(): string | null;
  getRefreshToken(): string | null;
  getExpiresAt(): string | null;
  setToken(value: string): void;
  setRefreshToken(value: string): void;
  setExpiresAt(value: string): void;
  // login(args: IBodyLogin): Promise<IResponseAuth>;
  // logout(): Promise<void>;
  // refreshToken(): Promise<IResponseAuth>;
}

export interface IAuthConfig {
  loginEndpoint: string;
  refreshEndpoint: string;
  tokenType: string;
  storageTokenKey: string;
  storageRefreshTokenKeyName: string;
  storageExpiresAtKeyName: string;
  storageUserDataName: string;
  storageNotificarLogout: string;
}