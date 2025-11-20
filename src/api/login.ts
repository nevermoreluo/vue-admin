import request from './request'

export interface LoginParams {
  name: string
  password: string
}

export interface LoginResponse {
  id?: number
  name?: string
  'sk-token'?: string
}

/**
 * 登录接口
 * @param params 登录参数
 * @returns 登录响应
 */
export const loginApi = (params: LoginParams): Promise<LoginResponse> => {
  return request.post('/login', params)
}
