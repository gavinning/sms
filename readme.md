SMS短信验证码
---
* 阿里云短信验证码发送和验证
* 腾讯云短信验证码发送和验证

### Install
```sh
npm i @4a/sms
# or
yarn add @4a/sms
```

### Options
```ts
interface Options {
    mode: Mode
    redis: Redis // ioredis
    debug?: boolean
    qqconfig?: QcloudConfig
    aliconfig?: AliyunConfig
}

enum Mode {
    aliyun = 'aliyun',
    qcloud = 'qcloud',
}

interface QcloudConfig {
    AppId: string
    accessKeyId: string
    accessKeySecret: string
    SignName: string
    TemplateId: string
    RegionId?: string // default = ap-guangzhou
}

interface AliyunConfig {
    accessKeyId: string
    accessKeySecret: string
    SignName: string
    TemplateId: string
    RegionId?: string // default = cn-hangzhou
}

```

### Usage
短信验证码会被存储在redis中
* 默认有效期：6分钟
* 默认存储Key：``app:sms:passcode:${tel}``
```ts
import SMS from '@4a/sms'
```
```js
const { SMS } = require('@4a/sms')
const { aliyunConfig, qcloudConfig } = require('./config')
const Redis = require('ioredis')
const redis = new Redis()

const client = new SMS({
    mode: 'aliyun',
    redis,
    debug: true,
    qqconfig: qcloudConfig,
    aliconfig: aliyunConfig,
})

// 创建一个短信验证码
// 模拟发送，可在测试环境使用该api
client.create(tel)

// 创建一个短信验证码
// 真实发送，生产环境使用该api
client.send(tel)


// 验证短信验证码是否合法
client.verify(tel, code)
```
