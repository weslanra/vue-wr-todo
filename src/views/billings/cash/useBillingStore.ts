import { defineStore } from 'pinia'
import type { CashParams, IResponseGetCash } from './types'
import axios from '@axios'

export const useBillingStore = defineStore('BillingStore', {
  actions: {
    // 👉 Fetch all Invoices
    fetchCash(params: CashParams): Promise<IResponseGetCash> {
      return axios.get('billings/cash', { params })
    },
  },
})
