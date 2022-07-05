/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-console */
import {run, ethers, upgrades, network} from 'hardhat'
import {log} from '../config/logging'

async function main() {
    await run('compile')

    const [deployer] = await ethers.getSigners()
    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())
    console.log('Network: ', network.name)
    let proxyAddress
    switch (network.name) {
        case 'hardhat':
        case 'localhost':
            proxyAddress = '0x0000000000000000000000000000000000000000'
            break
        case 'rinkeby':
            proxyAddress = '0x438Cb5e3b2A0C63eDD96E8f53BE4b588533458Cb'
            break
        case 'mainnet':
            proxyAddress = '0x0000000000000000000000000000000000000000'
            break
        default:
            throw new Error(`Unknown network: ${network.name}`)
    }
    console.log('Proxy Address:', proxyAddress)
    // We get the contract to deploy
    const Library = await ethers.getContractFactory('Library')
    const library = await upgrades.upgradeProxy(proxyAddress, Library)
    console.log('SAVE THIS - Library upgraded at:', library.address)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        log.error(error)
        process.exit(1)
    })
