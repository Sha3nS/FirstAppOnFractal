import { expect, use } from 'chai'
import { toByteString } from 'scrypt-ts'
import { Demo } from '../src/contracts/Demo'
import { getDefaultSigner } from './utils/txHelper'
import chaiAsPromised from 'chai-as-promised'
use(chaiAsPromised)

describe('Test SmartContract `Demo`', () => {
    let instance: Demo

    before(async () => {
        await Demo.loadArtifact()

        instance = new Demo(toByteString('hello', true), toByteString('world', true))
        await instance.connect(getDefaultSigner())
    })

    it('should pass the public method unit test successfully.', async () => {
        const deployTx = await instance.deploy(1)
        console.log(`Deployed contract "Firstapponfractal": ${deployTx.id}`)

        const call = async () => {
            const callRes = await instance.methods.helloworld(toByteString('helloworld', true))
            
            console.log(`Called "helloworld" method: ${callRes.tx.id}`)
        }
        await expect(call()).not.to.be.rejected
    })

    it('should throw with wrong message.', async () => {
        await instance.deploy(1)

        const call = async () => instance.methods.helloworld(toByteString('wrong message', true))
        await expect(call()).to.be.rejectedWith("Not Match")
    })
})
