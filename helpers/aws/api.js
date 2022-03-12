import log from 'ololog'
import Web3 from 'web3'
import AWSHttpProvider from '@aws/web3-http-provider'

export async function ethereumGetCurrentBlock () {
  try {
    const url = process.env.AWS_BLOCKCHAIN_ETHEREUM_NODE_HTTP_ENDPOINT
    const credentials = {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
    const web3 = new Web3(new AWSHttpProvider(url, credentials))
    const blockNumber = await web3.eth.getBlockNumber()
    return blockNumber
  } catch (error) {
    log.red(error)
  }
}
