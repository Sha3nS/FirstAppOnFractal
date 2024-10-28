import { getDefaultSigner } from './tests/utils/txHelper'
import { Demo } from './src/contracts/Demo' // Adjust the path based on your file structure
import { toByteString } from 'scrypt-ts'

async function callIncrementOnChain(
    txId: string,
    atOutputIndex = 0
): Promise<string> {
    // Fetch TX via provider and reconstruct contract instance.
    const signer = getDefaultSigner()
    const tx = await signer.connectedProvider.getTransaction(txId)
    const instance = Demo.fromTx(tx, atOutputIndex)

    await instance.connect(signer)

    const call = async () => {
        const callRes = await instance.methods.helloworld(toByteString('helloworld', true))
        console.log(`Called "helloworld" method: ${callRes.tx.id}`)
        return callRes.tx.id  // Add return statement
    }
    return await call()  // Add return statement
}
