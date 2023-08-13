
export interface IOperator {
  avatar: string;
  name: string;
  email: string;
}

export interface ICash {
  id: number;
  openingDate: string;
  operator: IOperator;
  status: "Aberto" | "Fechado";
  total: number;
  averageOfDay: number;
}

export interface CashParams {
  q?: string,
  status?: string,
  perPage: number,
  currentPage: number,
  startDate?: string,
  endDate?: string,
}

export interface IResponseGetCash extends IDefaultResponse {
  data: {
    data: ICash[];
    total: number;
    totalPage: number;
  }
}

export interface IDefaultResponse {
  config: {
    adapter: Function;
    baseURL: string;
    data: string;
    headers: Object;
    maxBodyLength: number;
    maxContentLength: number;
    method: string;
    timeout: number;
    transformRequest: Function[];
    transformResponse: Function[];
    url: string;
    validateStatus: Function;
    xsrfCookieName: string;
    xsrfHeaderName: string;
  };
  data: any;
  headers: Object;
  request: XMLHttpRequest;
  status: number;
  statusText: string;
}
