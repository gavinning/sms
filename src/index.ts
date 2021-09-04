import { ok } from 'assert'
import { Options, Message } from './config'
import Passcode from './passcode'

export class SMS {
    options: Options

    constructor(options: Options) {
        this.options = options
    }

    create(tel: string) {
        ok(tel, Message.LossParameterTel)
        return this.client(tel).create()
    }

    send(tel: string) {
        ok(tel, Message.LossParameterTel)
        return this.client(tel).send()
    }

    verify(tel: string, code: string) {
        ok(tel, Message.LossParameterTel)
        ok(code, Message.LossParameterCode)
        return this.client(tel).verify(code)
    }

    private client(tel: string) {
        return Passcode.init(tel, this.options)
    }
}

export default SMS
