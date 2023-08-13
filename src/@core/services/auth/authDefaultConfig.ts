import { IAuthConfig } from "@core/services/interfaces/auth/IAuthService";

const authConfig: IAuthConfig = {
  // Endpoints
  loginEndpoint: "/Connect/Token",
  refreshEndpoint: "/Connect/refreshtoken",

  // This will be prefixed in authorization header with token
  // e.g. Authorization: Bearer <token>
  tokenType: "Bearer",

  // Value of this property will be used as key to store JWT token in storage
  storageTokenKey: "apiToken",
  storageRefreshTokenKeyName: "refreshToken",
  storageExpiresAtKeyName: "expiresAtToken",

  // Valor da localStore com as informações do usuário
  storageUserDataName: "userData",
  storageNotificarLogout: "notificarLogout"
};

export default authConfig;
