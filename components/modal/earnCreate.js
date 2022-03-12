import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import Router from 'next/router'
import moment from 'moment'
import numeral from 'numeral'
import accounting from 'accounting-js'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import BN from 'bignumber.js'
import { ethers, BigNumber } from 'ethers'
import { createAlchemyWeb3 } from '@alch/alchemy-web3'
import { useWeb3React } from '@web3-react/core'
import log from 'ololog'

import { abiEthereumAFN } from '../../helpers/abi/ethereumAFN'
import { abiEthereumEarn } from '../../helpers/abi/ethereumEarn'
import { contentfulOptions } from '../../helpers/contentful/api'
import { get0xQuote } from '../../helpers/0x/api'
import networkName from '../../helpers/web3/networkName'

import { closeModal, openModal } from '../../redux/action/global'

import SelectWallet from './selectWallet'
import Loader from '../loader'

function EarnCreate (props) {
  const {
    currentAccount,
    currentNetwork,
    network,
    page,
    agreement,
    earnTerms,
    openModal,
    closeModal
  } = props
  const [amount, setAmount] = useState('')
  const [amountWei, setAmountWei] = useState(0)
  const [amountError, setAmountError] = useState(false)
  const [earnTermId, setEarnTermId] = useState(null)
  const [earnTermList, setEarnTermList] = useState(null)
  const [earnInterestBase, setEarnInterestBase] = useState(0)
  const [earnInterestBonus, setEarnInterestBonus] = useState(0)
  const [paybackDate, setPaybackDate] = useState(new Date())
  const [approved, setApproved] = useState(false)
  const [transactionPending, setTransactionPending] = useState(false)
  const [quote, setQuote] = useState(null)
  const [tokenAddress] = useState(currentNetwork.contracts.afn)
  const [swapTarget, setSwapTarget] = useState(null)
  const [swapCallData, setSwapCallData] = useState(null)
  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React()
  const openModalWallet = () => {
    openModal({
      title: get(page, 'selectWallet', 'Select Wallet'),
      size: 'md',
      component: <SelectWallet />
    })
  }
  const getQuote = async () => {
    const amountWei = BN(amount * (10 ** 18))
    const quote = await get0xQuote(amountWei.toString(), currentNetwork.contracts.afn, currentNetwork.contracts.usdc, chainId)
    if (get(quote, 'price', '').length > 0) {
      setQuote(quote)
      setSwapTarget(quote.to)
      setSwapCallData(quote.data)
      calculateInterest(quote)
    } else {
      setQuote(null)
      setSwapTarget(null)
      setSwapCallData(null)
      setEarnInterestBase(0)
      setEarnInterestBonus(0)
    }
  }
  const calculateInterest = (innerQuote) => {
    if (isNil(innerQuote)) {
      innerQuote = quote
    }
    const term = earnTermList[earnTermId]
    const usdcQuote = get(innerQuote, 'buyAmount', 0) / (10 ** 6)
    const earnContractInterest = (Number(term.time) * usdcQuote) * Number(term.usdcRate) / (10 ** 4) / 365
    setEarnInterestBase(earnContractInterest)
    switch (true) {
      case usdcQuote < 5000: {
        setEarnInterestBonus(0)
        break
      }
      case usdcQuote < 25000: {
        setEarnInterestBonus(earnTermList[earnTermId][4])
        break
      }
      case usdcQuote < 150000: {
        setEarnInterestBonus(earnTermList[earnTermId][3])
        break
      }
      case usdcQuote > 150000: {
        setEarnInterestBonus(earnTermList[earnTermId][2])
        break
      }
      default: {
        setEarnInterestBonus(0)
      }
    }
  }
  const calculateCloseDate = () => {
    var dateFuture = moment().add(earnTermList[earnTermId][0], 'days')
    setPaybackDate(moment(dateFuture).format('MM-DD-YYYY'))
  }
  const checkIfWalletIsApproved = async () => {
    try {
      if (active) {
        const signer = library.getSigner()
        const contractAFN = new ethers.Contract(currentNetwork.contracts.afn, abiEthereumAFN, signer)
        const allowance = await contractAFN.allowance(account, currentNetwork.contracts.earn)
        if (allowance > 0) {
          setApproved(true)
        } else {
          setApproved(false)
        }
      }
    } catch (error) {
      log.red(error)
    }
  }
  const approve = async () => {
    try {
      if (active) {
        const signer = library.getSigner()
        const contractAFN = new ethers.Contract(currentNetwork.contracts.afn, abiEthereumAFN, signer)
        const approve = await contractAFN.approve(currentNetwork.contracts.earn, BigNumber.from('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'))
        setTransactionPending(true)
        await approve.wait()
        setTransactionPending(false)
        setApproved(true)
      } else {
        log.red('Connect Wallet!')
      }
    } catch (error) {
      log.red(error)
    }
  }
  const getEarnTerms = async () => {
    try {
      const web3 = createAlchemyWeb3(currentNetwork.endpoint)
      const contractEarn = new web3.eth.Contract(JSON.parse(abiEthereumEarn), currentNetwork.contracts.earn)
      const earnTerms = await contractEarn.methods.getAllEarnTerms().call()
      setEarnTermList(earnTerms)
      setEarnTermId(0)
    } catch (error) {
      log.red('getAllEarnTerms error: ', error)
    }
  }
  const openEarnContractWithSwap = async () => {
    if (isNil(amount) || amount <= 0) {
      setAmountError(true)
    } else {
      setAmountError(false)
      try {
        if (active) {
          const signer = library.getSigner()
          const contractEarn = new ethers.Contract(currentNetwork.contracts.earn, abiEthereumEarn, signer)
          const earnCreate = await contractEarn.openContractTokenSwapToUSDC(
            earnTermId, // uint256 _earnTermsId,
            tokenAddress, // address _tokenAddress,
            amountWei, // uint256 _amount,
            swapTarget, // address _swapTarget, // TO field from 0xAPI
            swapCallData // bytes calldata _swapCallData // DATA field from 0xAPI
            , { gasLimit: ethers.utils.hexlify(2500000) })
          setTransactionPending(true)
          await earnCreate.wait()
          const length = await contractEarn.getAllEarnContracts()
          const netName = await networkName(chainId)
          setTransactionPending(false)
          Router.push('/earn/0x' + (length.length - 1) + '?network=' + netName)
          closeModal()
        } else {
          console.log('Connect Wallet!')
        }
      } catch (e) {
        log.red(e)
      }
    }
  }
  useEffect(() => {
    setAmountWei(BN(amount * (10 ** 18)).toString())
  }, [amount])
  useEffect(() => {
    checkIfWalletIsApproved()
  }, [])
  useEffect(() => {
    if (isNil(earnTermList)) {
      getEarnTerms()
    }
  }, [earnTermList])
  useEffect(() => {
    if (!isNil(earnTermId)) {
      calculateInterest()
      calculateCloseDate()
    }
  }, [earnTermId])
  return (
    <div>
      <div className='w-100 py-3'>
        <div className='row'>
          <div className='col-12 col-md-6'>
            <div className='form-group mb-0'>
              <div className='input-outer input-outer-title'>
                <div className='form-control'>{get(page, 'earnAmount', '')}</div>
              </div>
              <div
                className={`input-outer ${amountError && 'is-invalid'}`}
              >
                <input
                  className={`form-control form-control-lg ${amountError && 'is-invalid'}`}
                  id='inputAmount'
                  placeholder='0 AFN'
                  type='text'
                  value={amount}
                  onBlur={e => getQuote()}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
            </div>
            <div className='form-group mt-3 mb-0'>
              <div className='input-outer input-outer-title'>
                <div className='form-control'>{get(page, 'earnTerm', '')}</div>
              </div>
              <div className='input-outer'>
                <table className='table table-sm text-size-sm rounded mb-0'>
                  <tbody>
                    {isNil(earnTermList) &&
                      <tr>
                        <td colSpan={2} className='text-right'><Loader /></td>
                      </tr>}
                    {!isNil(earnTermList) && earnTermList.map((rate, i) => {
                      return (
                        <tr key={rate[0] + i} onClick={() => setEarnTermId(i)} className={`cursor-pointer ${i === earnTermId && 'active'}`}>
                          <td colSpan={2}>
                            {moment.duration(rate[0], 'days').asMonths().toFixed(0)} Months
                          </td>
                          <td className='text-right'>
                            {numeral(rate[1] / (10 ** 4)).format('0.00%')}<img src='/tokens/usdc.png' className='icon mx-2' />USDC
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className='col-12 col-md-6'>
            <div className='form-group mb-0'>
              <div className='input-outer input-outer-title'>
                <div className='form-control'>{get(page, 'earnContractDetails', '')}</div>
              </div>
              <div className='input-outer'>
                <table className='table table-sm text-size-sm rounded mb-0'>
                  <tbody>
                    <tr>
                      <td><img src='/tokens/afn.png' className='icon mr-2' />AFN</td>
                      <td className='text-right'>{numeral(amount).format('0,0.0000')}</td>
                    </tr>
                    <tr>
                      <td>
                        <img src='/tokens/usdc.png' className='icon' /> <strong>USDC Contract Value</strong>
                      </td>
                      <td className='text-right'>
                        {isNil(get(quote, 'buyAmount', null)) && <Loader />}
                        {!isNil(get(quote, 'buyAmount', null)) && <strong>{accounting.formatMoney((get(quote, 'buyAmount', 0) / (10 ** 6)), { precision: 6 })}</strong>}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='form-group mt-3 mb-0'>
              <div className='input-outer input-outer-title'>
                <div className='form-control'>{get(page, 'earnTotalInterest', '')}</div>
              </div>
              <div className='input-outer'>
                <table className='table table-sm text-size-sm rounded mb-0'>
                  <tbody>
                    <tr>
                      <td>
                        <img src='/tokens/usdc.png' className='icon' /> USDC
                      </td>
                      <td className='text-right'>{numeral(Number(get(earnTermList, `[${earnTermId}][1]`, 0)) / (10 ** 4)).format('0.00%')}</td>
                      <td className='text-right'>{accounting.formatMoney(earnInterestBase, { precision: 6 })}</td>
                    </tr>
                    <tr>
                      <td>
                        <img src='/tokens/afn.png' className='icon' /> AFN
                      </td>
                      <td className='text-right' colSpan='2'>{numeral(earnInterestBonus).format('0,0')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className='form-group mt-3 mb-0'>
              <div className='input-outer input-outer-title'>
                <div className='form-control'>{get(page, 'earnCloseDate', 'Close Date')}</div>
              </div>
              <div className='input-outer'>
                <table className='table table-sm text-size-sm rounded mb-0'>
                  <tbody>
                    <tr>
                      <td>{get(page, 'earnDate', 'Date')}</td>
                      <td className='text-right'>{moment(paybackDate).format('MMM DD, YYYY')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex w-100 justify-content-end mt-5'>
          {transactionPending && <Loader />}
          {!active && !transactionPending && <button className='btn btn-pill btn-outline-primary btn-animate' onClick={openModalWallet}>{get(page, 'connectToWallet', 'Connect to Wallet')}</button>}
          {!approved && active && !transactionPending && <button className='btn btn-pill btn-outline-primary btn-animate' onClick={approve}>{get(page, 'stakeApprove', 'Approve')} AFN</button>}
          {approved && active && !transactionPending && <button className='btn btn-pill btn-outline-primary btn-animate' onClick={openEarnContractWithSwap}>Open Earn Contract</button>}
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  currentAccount: state.global.currentAccount,
  currentNetwork: state.global.currentNetwork,
  network: state.global.network
})

const mapDispatchToProps = dispatch => ({
  openModal: (modal) => dispatch(openModal(modal)),
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(EarnCreate)
