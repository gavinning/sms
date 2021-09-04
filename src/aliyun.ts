import AliyunCore, { Config } from '@alicloud/pop-core'
import { AliyunSMSConfig, Client, PlainObject } from './config'

export default class Aliyun implements Client {
    private readonly options: Config
    private readonly params: PlainObject

    constructor(options: AliyunSMSConfig) {
        this.options = this.createOptions(options)
        this.params = this.createParams(options)
    }

    async send() {
        return this.client()
            .request('SendSms', this.params, { method: 'POST' })
            .then(() => true)
    }

    private client() {
        return new AliyunCore(this.options)
    }

    private createParams(options: AliyunSMSConfig) {
        return {
            RegionId: options.RegionId || 'cn-hangzhou',
            SignName: options.SignName,
            TemplateCode: options.TemplateId,
            PhoneNumbers: options.tel,
            TemplateParam: JSON.stringify({ code: options.code }),
        }
    }

    private createOptions(options: AliyunSMSConfig) {
        return {
            accessKeyId: options.accessKeyId,
            accessKeySecret: options.accessKeySecret,
            endpoint: 'https://dysmsapi.aliyuncs.com',
            apiVersion: '2017-05-25',
        }
    }

    static send(options: AliyunSMSConfig) {
        return new Aliyun(options).send()
    }
}
