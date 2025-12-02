import request from './request'

export interface SummaryCountResponse {
  code: number
  data: {
    departments_count: number
    device_types_count: number
    devices_count: number
    devices_online_count: number
  }
}

export interface DeviceUsageItem {
  name: string
  value: string | number
}

export interface DeviceUsageResponse {
  code: number
  data: DeviceUsageItem[]
}

export const fetchSummaryCount = async (): Promise<SummaryCountResponse['data']> => {
  const response = (await request.get(
    '/homepage/data/summary_count',
  )) as unknown as SummaryCountResponse
  return response.data
}

export const fetchDeviceUsage = async (): Promise<DeviceUsageResponse['data']> => {
  const response = (await request.get(
    '/homepage/data/device_usage_count',
  )) as unknown as DeviceUsageResponse
  return response.data
}

export interface DeviceDeployItem {
  name: string
  value: string | number
}

export interface DeviceDeployResponse {
  code: number
  data: DeviceDeployItem[]
}

export const fetchDeviceDeployCount = async (params: {
  deploy_time_start: string
  deploy_time_end: string
}): Promise<DeviceDeployResponse['data']> => {
  const response = (await request.get('/homepage/data/device_deploy_count_time_line', {
    params,
  })) as unknown as DeviceDeployResponse
  return response.data
}
