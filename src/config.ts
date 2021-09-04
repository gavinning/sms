import { Redis } from 'ioredis'

export enum Mode {
    aliyun = 'aliyun',
    qcloud = 'qcloud',
}

export const enum Message {
    ErrorOptions = 'options error',
    LossParameter = 'loss parameter',
    LossParameterTel = 'loss parameter tel',
    LossParameterCode = 'loss parameter code',
}

export interface Client {
    send(): Promise<boolean>
}

export interface PlainObject {
    [key: string]: any
}

interface PublicPasscode {
    tel: string
    code: string
}

interface PublicSMSConfig {
    accessKeyId: string
    accessKeySecret: string
    SignName: string
    TemplateId: string
    RegionId?: string
}

// For Options
export interface AliyunConfig extends PublicSMSConfig {}
// For class Aliyun
export interface AliyunSMSConfig extends AliyunConfig, PublicPasscode {}

// For Options
export interface QcloudConfig extends PublicSMSConfig {
    AppId: string
}
// For class Qcloud
export interface QcloudSMSConfig extends QcloudConfig, PublicPasscode {}

export interface Options {
    mode: Mode
    redis: Redis
    debug?: boolean
    qqconfig?: QcloudConfig
    aliconfig?: AliyunConfig
}
