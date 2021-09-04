import { QcloudSMSConfig, Client } from './config'
import * as Tencentcloud from 'tencentcloud-sdk-nodejs'
import { ClientConfig } from 'tencentcloud-sdk-nodejs/tencentcloud/common/interface'
import { SendSmsRequest } from 'tencentcloud-sdk-nodejs/tencentcloud/services/sms/v20210111/sms_models'

export class Qcloud implements Client {
    private readonly params: SendSmsRequest
    private readonly options: ClientConfig

    constructor(options: QcloudSMSConfig) {
        this.params = this.createParams(options)
        this.options = this.createOptions(options)
    }

    async send() {
        return this.client()
            .SendSms(this.params)
            .then(() => true)
    }

    private client() {
        return new Tencentcloud.sms.v20210111.Client(this.options)
    }

    private createParams(options: QcloudSMSConfig): SendSmsRequest {
        return {
            SmsSdkAppId: options.AppId,
            SignName: options.SignName,
            PhoneNumberSet: ['+86' + options.tel],
            TemplateId: options.TemplateId,
            TemplateParamSet: [options.code, '5'],
            ExtendCode: '',
            SenderId: '',
            SessionContext: '',
        }
    }

    private createOptions(options: QcloudSMSConfig): ClientConfig {
        return {
            credential: {
                secretId: options.accessKeyId,
                secretKey: options.accessKeySecret,
            },
            region: options.RegionId || 'ap-guangzhou',
            profile: {
                signMethod: 'HmacSHA256',
                httpProfile: {
                    reqMethod: 'POST',
                    reqTimeout: 30,
                    endpoint: 'sms.tencentcloudapi.com',
                },
            },
        }
    }

    static send(options: QcloudSMSConfig) {
        return new Qcloud(options).send()
    }
}

export default Qcloud
