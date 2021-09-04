const Redis = require('ioredis')
const redis = new Redis()
const assert = require('assert')
const { SMS } = require('..')
const { tel, aliyunSMSConfig, qcloudSMSConfig } = require('./sms.config')

const client = new SMS({
    mode: 'qcloud',
    redis,
    debug: true,
    qqconfig: qcloudSMSConfig,
    aliconfig: aliyunSMSConfig,
})

describe('test class Passcode', () => {
    const passcodeKey = `app:sms:passcode:${tel}`

    it('test create, verify', async () => {
        const code = await client.create(tel)
        const code1 = await redis.get(passcodeKey)
        const result = await client.verify(tel, code)
        assert.equal(code, code1)
        assert.equal(true, result)
    })

    // 测试短信发送可以打开当前注释，测试不同渠道记得修改mode的值
    // it('test publish, verify', async () => {
    //     const code = await client.send(tel)
    //     const result = await client.verify(tel, code)
    //     assert.equal(true, result)
    //     redis.expire(passcodeKey, 300)
    // })
})
