/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ethers } from 'ethers'
import Web3 from 'web3'
import log from 'ololog'
import toLower from 'lodash/toLower'
import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'

import { SUPPORTED_WALLETS } from '../../helpers/web3/wallets'
import networkName from '../../helpers/web3/networkName'
import { RPC } from '../../helpers/web3/rpc'
import { useEagerConnect, useInactiveListener } from '../../helpers/web3/hooks'

import { setCurrentAccount, closeModal } from '../../redux/action/global'

import {
  injected,
  walletconnect,
  walletlink,
  fortmatic,
  clover,
  binance,
  portis,
  keystone,
  torus,
  lattice
} from '../../helpers/web3/connectors'

var ConnectorNames;
(function (ConnectorNames) {
  ConnectorNames.Injected = 'Metamask'
  ConnectorNames.WalletConnect = 'WalletConnect'
  ConnectorNames.WalletLink = 'Coinbase'
  ConnectorNames.Fortmatic = 'Fortmatic'
  ConnectorNames.Clover = 'Clover'
  ConnectorNames.Binance = 'Binance'
  ConnectorNames.Portis = 'Portis'
  ConnectorNames.Keystone = 'Keystone'
  ConnectorNames.Torus = 'Torus'
  ConnectorNames.Lattice = 'Lattice'
})(ConnectorNames || (ConnectorNames = {}))

// Here you can change the order in which the wallets show up
const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  // [ConnectorNames.WalletConnect]: walletconnect,
  [ConnectorNames.WalletLink]: walletlink,
  [ConnectorNames.Fortmatic]: fortmatic,
  [ConnectorNames.Clover]: clover,
  // [ConnectorNames.Binance]: binance,
  [ConnectorNames.Portis]: portis,
  // [ConnectorNames.Keystone]: keystone,
  [ConnectorNames.Torus]: torus
  // [ConnectorNames.Lattice]: lattice

}

function SelectWallet (props) {
  const {
    setCurrentAccount,
    closeModal
  } = props

  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React()
  const isHmyLibrary = (library?.messenger?.chainType === 'hmy')

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState()

  const setNetwork = async (account, chainId) => {
    const network = await networkName(chainId)
    setCurrentAccount({
      account: account,
      provider: network
    })
  }
  const connect = async (currentConnector, connectorName) => {
    try {
      await setActivatingConnector(currentConnector)
      await activate(connectorName)
      await setNetwork(account, chainId)
      closeModal()
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <div className='w-100 d-flex align-items-center justify-content-center p-3'>
        <ul className='list-group w-100'>
          {Object.keys(connectorsByName).map(name => {
            const currentConnector = connectorsByName[name]
            return (
              <li
                className='list-group-item list-group-item-button d-flex align-items-center justify-content-between' key={name}
                onClick={() => {
                  connect(currentConnector, connectorsByName[name])
                }}
              >
                <span>{name}</span>
                <img src={`/icons/${toLower(name)}.png`} className='img-fluid img-fluid-icon' style={{ width: '32px' }} />
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  currentAccount: state.global.currentAccount
})

const mapDispatchToProps = dispatch => ({
  setCurrentAccount: (currentAccount) => dispatch(setCurrentAccount(currentAccount)),
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(SelectWallet)
