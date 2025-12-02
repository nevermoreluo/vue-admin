import request from '@/api/request'

export interface DeviceListParams {
    pages: number
    page_size: number
    device_type_id: number | undefined
    device_usage_id: number | undefined
    department_id: number | undefined
    serial_number: string | undefined
    is_enable: number | undefined
    is_online: number | undefined
}

export interface DeviceListResponseData {
    id: number
    device_type_id: number
    device_usage_id: number
    department_id: number
    serial_number: string
    is_enable: number
    is_online: number
    created_at: string
    updated_at: string
    GB28281_ID: string
    account: string
    deploy_time: string
    device_ip: string
    device_port: number
    device_type: {
        hardware_type: string
        id: number
        serial_number: string
    }
    device_usage: {
        id: number
        identify: string
        name: string
    }
    door_access_reader_ip: string
    local_ip: string
    local_port: number
    name: string
    nvr_binding_channel_ips: string
    password: string
    place: string
    supplier: {
        id: number
        name: string
    }
    last_online_time: string
}

export interface DeviceListResponse {
    pages: number
    page_size: number
    total: number
    total_pages: number
    data: DeviceListResponseData[]
}

export interface DeviceTypeListParams {
    pages: number
    page_size: number
}

export interface DeviceTypeListResponseData {
    id: number
    hardware_type: string
    created_at: string
    updated_at: string
}

export interface DeviceTypeListResponse {
    pages: number
    page_size: number
    total: number
    total_pages: number
    data: DeviceTypeListResponseData[]
}


export interface DeviceUsagesParams {
    pages: number
    page_size: number
}


export interface DeviceUsagesResponseData {
    id: number
    identify: string
    name: string
}


export interface DeviceUsagesResponse {
    pages: number
    page_size: number
    total: number
    total_pages: number
    data: DeviceUsagesResponseData[]
}


export interface DepartmentListParams {
    pages: number
    page_size: number
}

export interface DepartmentListResponseData {
    id: number
    name: string
    created_at: string
}

export interface DepartmentListResponse {
    pages: number
    page_size: number
    total: number
    total_pages: number
    data: DepartmentListResponseData[]
}

export interface SupplierListParams {
    pages: number
    page_size: number
}

export interface SupplierListResponseData {
    id: number
    name: string
    created_at: string
}

export interface SupplierListResponse {
    pages: number
    page_size: number
    total: number
    total_pages: number
    data: SupplierListResponseData[]
}

export const getDevices = (params: DeviceListParams) : Promise<DeviceListResponse> => {
    return request.get('/devices', { params })
}

export const getDeviceTypes = (params: DeviceTypeListParams) : Promise<DeviceTypeListResponse> => {
    return request.get('/deviceTypes', { params })
}


export const getDeviceUsages = (params: DeviceUsagesParams) : Promise<DeviceUsagesResponse> => {
    return request.get('/deviceUsages', { params })
}

export const getDepartments = (params: DepartmentListParams) : Promise<DepartmentListResponse> => {
    return request.get('/departments', { params })
}

export const getSuppliers = (params: SupplierListParams) : Promise<SupplierListResponse> => {
    return request.get('/suppliers', { params })
}
