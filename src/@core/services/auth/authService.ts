import {
  IAuthConfig,
  IAuthService,
} from "@core/services/interfaces/auth/IAuthService";
import { AxiosInstance } from "axios";
import authDefaultConfig from "./authDefaultConfig";

export default class AuthService implements IAuthService {
  // Will be used by this service for making API calls
  axiosIns: AxiosInstance;

  // serviceConfig <= Will be used by this service
  serviceConfig: IAuthConfig;

  // For Refreshing Token
  isAlreadyFetchingAccessToken: boolean;

  // For Refreshing Token
  subscribers: Array<Function>;
  offSubscribers: Array<Function>;

  constructor(axiosIns: AxiosInstance, authOverrideConfig: Object) {
    this.axiosIns = axiosIns;
    this.serviceConfig = { ...authDefaultConfig, ...authOverrideConfig };
    this.isAlreadyFetchingAccessToken = false;
    this.subscribers = [];
    this.offSubscribers = [];

    // Request Interceptor
    this.axiosIns.interceptors.request.use(
      (config: any) => {
        // Get token from localStorage
        const accessToken = this.getToken();

        // If token is present add it to request's Authorization Header
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.serviceConfig.tokenType} ${accessToken}`;
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add request/response interceptor
    this.axiosIns.interceptors.response.use(
      (response) => response,
      (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.isAlreadyFetchingAccessToken = true;

            // this.refreshToken()
            //   .then((r: any) => {
            //     this.isAlreadyFetchingAccessToken = false;
            //     // Update accessToken in localStorage
            //     this.setToken(r.data.token);
            //     this.setRefreshToken(r.data.refreshToken);
            //     this.setExpiresAt(r.data.expiresAt);

            //     this.onAccessTokenFetched(r.data.token);
            //   })
            //   .catch(() => {
            //     this.offAccessTokenFetched();

            //     localStorage.setItem(
            //       this.serviceConfig.storageNotificarLogout,
            //       "true"
            //     );

            //     this.logout(window.location.pathname).catch(() => {
            //       console.log("Erro no logout.");
            //     });
            //   });
          }

          const retryOriginalRequest = new Promise((resolve, reject) => {
            this.addSubscriber((accessToken: string) => {
              // Make sure to assign accessToken according to your response.
              // Check: https://pixinvent.ticksy.com/ticket/2413870
              // Change Authorization header
              originalRequest.headers.Authorization = `${this.serviceConfig.tokenType} ${accessToken}`;
              resolve(this.axiosIns(originalRequest));
            });

            this.addOffSubscriber(() => {
              reject(error);
            });
          });

          return retryOriginalRequest;
        }

        return Promise.reject(error);
      }
    );
  }

  onAccessTokenFetched(accessToken: string): void {
    this.subscribers = this.subscribers.filter((callback) =>
      callback(accessToken)
    );
  }

  offAccessTokenFetched(): void {
    this.offSubscribers = this.offSubscribers.filter((callback) => callback());
  }

  addSubscriber(callback: Function): void {
    this.subscribers.push(callback);
  }

  addOffSubscriber(callback: Function): void {
    this.offSubscribers.push(callback);
  }

  createCookie(name: string, value: string, days: number) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      var expires = "; expires=" + date.toString();
    } else {
      var expires = "";
    }

    document.cookie = `${name}=${value + expires};path=/; domain=${
      process.env.VUE_APP_DOMAIN
    }`;
  }

  readCookie(name: string) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) == 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }

    return null;
  }

  eraseCookie(name: string) {
    this.createCookie(name, "", -1);
  }

  getToken(): string | null {
    return this.readCookie(
      this.serviceConfig.storageTokenKey
    );
  }

  getRefreshToken(): string | null {
    return this.readCookie(this.serviceConfig.storageRefreshTokenKeyName);
  }

  getExpiresAt(): string | null {
    return this.readCookie(this.serviceConfig.storageExpiresAtKeyName);
  }

  setToken(token: string): void {
    this.createCookie(
      this.serviceConfig.storageTokenKey,
      token,
      1
    );
  }

  setRefreshToken(value: string): void {
    this.createCookie(this.serviceConfig.storageRefreshTokenKeyName, value, 1);
  }

  setExpiresAt(value: string): void {
    this.createCookie(this.serviceConfig.storageExpiresAtKeyName, value, 1);
  }
}
