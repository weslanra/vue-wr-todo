import useAuth from '@core/services/auth/useAuth';
import axios from 'axios';
// import defaultConfig from '../defaultConfig';

const axiosIns = axios.create( {
  baseURL: "",
  // baseURL: defaultConfig.authenticationService,
  headers: {
    "Content-Type": "application/json",
    crossdomain: true,
    "Access-Control-Allow-Origin": "*",
  }
} );

const { auth } = useAuth( axiosIns, {} );
export default auth;
