import { Demo } from './src/contracts/Demo'
import {
    bsv,
    TestWallet,
    DefaultProvider,
    toByteString,
} from 'scrypt-ts'

import * as dotenv from 'dotenv'

// Load the .env file
dotenv.config()

if (!process.env.PRIVATE_KEY || !process.env.PROVIDER_RPC) {
    throw new Error(
        'Missing .env vars. Please check:\n' +
        '- PRIVATE_KEY (run "npm run genprivkey" to generate)\n' +
        '- PROVIDER_RPC (your Bitcoin node RPC endpoint)'
    )
}

// Read the private key from the .env file.
// The default private key inside the .env file is meant to be used for the Bitcoin testnet.
// See https://scrypt.io/docs/bitcoin-basics/bsv/#private-keys
const privateKey = bsv.PrivateKey.fromWIF(process.env.PRIVATE_KEY || '')
const rpc = process.env.PROVIDER_RPC
// ...

// chaneg the necessary params here, like magics etc.
// const mainnet = {
//     name: 'livenet',
//     alias: 'mainnet',
//     pubkeyhash: 0x00,
//     privatekey: 0x80,
//     scripthash: 0x05,
//     xpubkey: 0x0488b21e,
//     xprivkey: 0x0488ade4,
//     networkMagic: 0xe3e1f3e8,
//     port: 8333,
//     dnsSeeds: [
//         'seed.bitcoinsv.io',
//         'seed.cascharia.com',
//         'seed.satoshisvision.network'
//     ]
// };
// const testnet = {
//     name: 'testnet',
//     alias: 'testnet',
//     pubkeyhash: 0x6f,
//     privatekey: 0xef,
//     scripthash: 0xc4,
//     xpubkey: 0x043587cf,
//     xprivkey: 0x04358394,
//     networkMagic: 0xf4e5f3f4,
//     port: 18333,
//     dnsSeeds: [
//         'testnet-seed.bitcoinsv.io',
//         'testnet-seed.cascharia.com',
//         'testnet-seed.bitcoincloud.net'
//     ]
// };
// you can also put them in the ENV and read them from different network type / profile
const FractalNetwork = {
    ...bsv.Networks.testnet,
    // networkMagic: 0xYourMagic,  // Replace with your network magic
    // rpc: 'your-rpc-endpoint',
}

// Prepare signer.
// See https://scrypt.io/docs/how-to-deploy-and-call-a-contract/#prepare-a-signer-and-provider
const signer = new TestWallet(
    privateKey,
    new DefaultProvider({
        network: FractalNetwork,
    })
)

async function main() {
    await Demo.loadArtifact()

    // TODO: Adjust the amount of satoshis locked in the smart contract:
    const amount = 1

    const instance = new Demo(toByteString('hello', true), toByteString('world', true))

    // Connect to a signer.
    await instance.connect(signer)

    // Contract deployment.
    const deployTx = await instance.deploy(amount)
    console.log(`Firstapponfractal contract deployed: ${deployTx.id}`)
}

main()
