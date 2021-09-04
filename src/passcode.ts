import asp from '@4a/asp'
import Aliyun from './aliyun'
import Qcloud from './qcloud'
import { ok } from 'assert'
import { Redis } from 'ioredis'
import { Mode, Client, Options, AliyunConfig, QcloudConfig, Message } from './config'

export default class Passcode {
    private readonly tel: string
    private readonly mode: Mode
    private readonly redis: Redis
    private readonly debug: boolean
    private readonly qqconfig?: QcloudConfig
    private readonly aliconfig?: AliyunConfig

    constructor(tel: string, { mode, redis, debug, qqconfig, aliconfig }: Options) {
        const aliyunMode = mode === Mode.aliyun && aliconfig
        const qcloudMode = mode === Mode.qcloud && qqconfig
        ok(aliyunMode || qcloudMode, Message.ErrorOptions)
        this.tel = tel
        this.mode = mode
        this.redis = redis
        this.debug = debug || false
        this.aliconfig = aliconfig
        this.qqconfig = qqconfig
    }

    async create() {
        const code = await this.save()
        this.debug && asp.debug('SMS created:', this.mode, this.tel, code)
        return code
    }

    async send() {
        const code = await this.save()
        await this.client(code).send()
        this.debug && asp.debug('SMS sent:', this.mode, this.tel, code)
        return code
    }

    async verify(code: string) {
        return Number(code) === Number(await this.redis.get(this.getKey()))
    }

    private client(code: string): Client {
        return this.mode === Mode.aliyun
            ? new Aliyun({ tel: this.tel, code, ...this.aliconfig! })
            : new Qcloud({ tel: this.tel, code, ...this.qqconfig! })
    }

    private async save() {
        const code = this.generator()
        await this.redis.set(this.getKey(), code, 'EX', 6 * 60)
        return code
    }

    private getKey() {
        return ['app:sms:passcode', this.tel].join(':')
    }

    private generator() {
        return Math.round(Math.random() * 1000000)
            .toString()
            .slice(0, 4)
    }

    static init(tel: string, options: Options) {
        return new Passcode(tel, options)
    }
}
