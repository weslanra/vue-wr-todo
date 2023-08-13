import { AxiosInstance } from 'axios';
import AuthService from './authService';

export default function useAuth( axiosIns: AxiosInstance, authOverrideConfig: Object ) {
  const auth = new AuthService( axiosIns, authOverrideConfig );

  return {
    auth
  }
}