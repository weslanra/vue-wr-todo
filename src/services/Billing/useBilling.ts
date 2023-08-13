import useBilling from "@core/services/billing/useBilling";
import axios from "axios";
// import defaultConfig from "../../defaultConfig";

const axiosIns = axios.create({
  baseURL: "",
  // baseURL: defaultConfig.coverageAreaService,
  headers: {
    "Content-Type": "application/json",
    crossdomain: true,
    "Access-Control-Allow-Origin": "*",
  },
});

const { billing } = useBilling(axiosIns, {});
export default billing;
