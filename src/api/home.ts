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
