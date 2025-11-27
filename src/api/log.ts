import request from '@/api/request'

export interface LogParams {
  pages: number
  page_size: number
  start_time: string
  end_time: string
  record_type: number|string
  url: string
}

export interface LogResponseData {
    created_at: string
    id: number
    record_type: number
    url: string,
    data: string
}

export interface LogResponse {
  pages: number
  page_size: number
  total: number
  total_pages: number
  data: LogResponseData[]
}

/**
 * 登录接口
 * @param params 登录参数
 * @returns 登录响应
 */
export const logApi = (params: LogParams): Promise<LogResponse> => {
  return request.get(`/oprecords?pages=${params.pages}&page_size=${params.page_size}&record_type=${params.record_type}&start_time=${params.start_time}&end_time=${params.end_time}&url=${params.url}`)
}
