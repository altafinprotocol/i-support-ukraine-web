import React, { useState, useEffect } from 'react'
import { ethers, BigNumber } from 'ethers'
import Link from 'next/link'
import get from 'lodash/get'
import includes from 'lodash/includes'
import filter from 'lodash/filter'
import isNil from 'lodash/isNil'
import Flags from 'country-flag-icons/react/1x1'
import LocaleCode from 'locale-code'
import { useRouter } from 'next/router'
import { connect } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import log from 'ololog'

import { setCurrentAccount, openModal } from '../redux/action/global'

import usePrevious from '../helpers/web3/usePrevious'
import networkName from '../helpers/web3/networkName'

import SelectWallet from './modal/selectWallet'

function Header (props) {
  const router = useRouter()
  const {
    page,
    transparent,
    openModal,
    currentAccount,
    currentNetwork,
    setCurrentAccount,
    forceLightMode,
    forceDarkMode
  } = props
  const [menu, setMenu] = useState([])
  const [dropdownLanguage, setDropdownLanguage] = useState(false)
  const [dropdownProfile, setDropdownProfile] = useState(false)
  const [mobileActive, setMobileActive] = useState(false)
  const [mode, setMode] = useState('dark')
  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React()
  const previousAccount = usePrevious(account)
  const activePrevious = usePrevious(active)
  const connectorPrevious = usePrevious(connector)
  const onSelectMode = (mode) => {
    setMode(mode)
    if (typeof window !== 'undefined') {
      if (mode === 'light') { document.body.classList.add('light-mode') } else { document.body.classList.remove('light-mode') }
    }
  }
  const setNetwork = async (account, chainId) => {
    const network = await networkName(chainId)
    if (chainId === 0x1 || chainId === 0x3) {
      try {
        const ens = await library.lookupAddress(account)
        if (!isNil(ens)) {
          setCurrentAccount({
            account: ens,
            provider: network
          })
        } else {
          setCurrentAccount({
            account: account,
            provider: network
          })
        }
      } catch (e) {
        log.red.error(e)
      }
    } else {
      setCurrentAccount({
        account: account,
        provider: network
      })
    }
  }
  const checkIfWalletIsConnected = async () => {
    try {
      if (account) {
        setNetwork(account, chainId)
      } else {
        setCurrentAccount('')
      }
    } catch (error) {
      log.red(error)
    }
  }
  const openModalWallet = () => {
    openModal({
      title: get(page, 'fields.selectWallet', 'Select Wallet'),
      size: 'md',
      component: <SelectWallet />
    })
  }
  // useEffect(() => {
  //   setDropdownLanguage(false)
  // }, [header])
  useEffect(() => {
    if (dropdownProfile) {
      setDropdownLanguage(false)
    }
  }, [dropdownProfile])
  useEffect(() => {
    if (dropdownLanguage) {
      setDropdownProfile(false)
    }
  }, [dropdownLanguage])
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [account, chainId])
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => onSelectMode(e.matches ? 'light' : 'dark'))
      onSelectMode(window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      return () => {
        window.matchMedia('(prefers-color-scheme: light)').removeEventListener('change', () => {})
      }
    }
  }, [])
  return (
    <header className={`header d-flex align-items-center justify-content-between w-100 ${transparent && 'header-transparent'} ${forceLightMode && 'header-force-light-mode'} ${forceDarkMode && 'header-force-dark-mode'} ${mobileActive ? 'active' : ''}`}>
      <div className='navbar-toggle' onClick={() => setMobileActive(true)}>
        <i className='far fa-bars' />
      </div>
      <Link href='/mint'>
        <a className='navbar-brand navbar-brand-mobile' onClick={() => setMobileActive(false)}>
          <img src='/isupportukraine.png' id='logo-isupportukraine' />
        </a>
      </Link>
      <nav className='navbar navbar-expand-lg navbar-light bg-transparent w-100'>
        <Link href='/stake'>
          <a className='navbar-brand' onClick={() => setMobileActive(false)}>
            <img src='/isupportukraine.png' id='logo-isupportukraine' />
          </a>
        </Link>
        <ul className='nav mr-2 mr-md-auto align-items-center'>
          <li className={`nav-item mx-3 mx-md-0 ${router.pathname === '/mint' && 'nav-item-active'}`}>
            <Link href='/mint' as='/mint'>
              <a className='nav-link p-0 text-size-sm' onClick={() => setMobileActive(false)}>{get(page, 'mint.content.buttonMenuMint', 'Mint')}</a>
            </Link>
          </li>
        </ul>
        <ul className='nav nav-sub mr-2 align-items-center'>
          {active && get(currentAccount, 'account', '').length > 0 && <li className='nav-item nav-account nav-item-active'>
            <a className='nav-link p-0 text-size-sm'>
              <span className='text-capitalize font-weight-regular mr-3'>{currentAccount.provider}</span>
              <br className='d-block d-md-none' />{currentAccount.account}
            </a>
          </li>}
          {!active && <li className='nav-item'>
            <a className='nav-link p-0 cursor-pointer text-size-sm' onClick={openModalWallet}>
              {get(page, 'mint.buttonConnectWallet', 'Connect Wallet')}
            </a>
          </li>}
          <li className='nav-item dropdown mt-2 mt-md-0'>
            <a
              className='nav-link p-0 cursor-pointer text-size-sm'
              onClick={() => setDropdownLanguage(!dropdownLanguage)}
            >
              {LocaleCode.getLanguageNativeName(router.locale)}
              <i className='far fa-chevron-down ml-1' />
            </a>
            <div className={`dropdown-menu shadow-lg border-0 ${dropdownLanguage ? 'show' : ''}`}>
              <Link href={router.pathname} locale='ru-UA'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.UA /></div>
                  {LocaleCode.getLanguageNativeName('ru-UA')}
                </a>
              </Link>
              <Link href={router.pathname} locale='en-US'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3' locale='en-US'><Flags.US /></div>
                  {LocaleCode.getLanguageNativeName('en-US')}
                </a>
              </Link>
              <Link href={router.pathname} locale='fr-FR'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.FR /></div>
                  {LocaleCode.getLanguageNativeName('fr-FR')}
                </a>
              </Link>
              <Link href={router.pathname} locale='es-ES'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.ES /></div>
                  {LocaleCode.getLanguageNativeName('es-ES')}
                </a>
              </Link>
              <Link href={router.pathname} locale='de-DE'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.DE /></div>
                  {LocaleCode.getLanguageNativeName('de-DE')}
                </a>
              </Link>
              <Link href={router.pathname} locale='it-IT'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.IT /></div>
                  {LocaleCode.getLanguageNativeName('it-IT')}
                </a>
              </Link>
              <Link href={router.pathname} locale='sv-SE'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.SE /></div>
                  {LocaleCode.getLanguageNativeName('sv-SE')}
                </a>
              </Link>
              <Link href={router.pathname} locale='pl-PL'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.PL /></div>
                  {LocaleCode.getLanguageNativeName('pl-PL')}
                </a>
              </Link>
              <Link href={router.pathname} locale='pt-PT'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.PT /></div>
                  {LocaleCode.getLanguageNativeName('pt-PT')}
                </a>
              </Link>
              <Link href={router.pathname} locale='zh-CN'>
                <a className='dropdown-item d-flex align-items-center justify-content-start pl-3' onClick={() => setMobileActive(false)}>
                  <div className='icon-flag shadow-sm mr-3'><Flags.CN /></div>
                  {LocaleCode.getLanguageNativeName('zh-CN')}
                </a>
              </Link>
            </div>
          </li>
          {mode === 'dark' ? <li className='nav-item mt-2 mt-md-0 cursor-pointer' onClick={() => onSelectMode('light')}><a className='nav-link p-0 cursor-pointer text-size-sm'><i className='far fa-sun' /></a></li>
            : <li className='nav-item mt-2 mt-md-0 cursor-pointer' onClick={() => onSelectMode('dark')}><a className='nav-link p-0 cursor-pointer text-size-sm'><i className='far fa-moon' /></a></li>}

        </ul>
        <div className='btn-group btn-group-sm'>
          <a onClick={() => setMobileActive(false)}><button type='button' className='btn btn-sm btn-outline-light px-3 d-block d-md-none'><i className='far fa-times' /></button></a>
        </div>
      </nav>
    </header>
  )
}

const mapStateToProps = state => ({
  currentAccount: state.global.currentAccount,
  currentNetwork: state.global.currentNetwork
})

const mapDispatchToProps = dispatch => ({
  openModal: (modal) => dispatch(openModal(modal)),
  setCurrentAccount: (currentAccount) => dispatch(setCurrentAccount(currentAccount))
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
