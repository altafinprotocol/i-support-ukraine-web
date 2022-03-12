import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { ethers, BigNumber, utils } from 'ethers'
import { connect } from 'react-redux'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import numeral from 'numeral'
import { useWeb3React } from '@web3-react/core'
import Confetti from 'react-dom-confetti'
import { MerkleTree } from 'merkletreejs'
import keccak256 from 'keccak256'
import log from 'ololog'

import { abiEthereumMint } from '../helpers/abi/ethereumMint'
import { content } from '../helpers/content/content'
import { confettiConfig } from '../helpers/confetti/confetti'
import { merkleTree } from '../helpers/merkleTree/merkleTree'

import { openModal } from '../redux/action/global'

import SelectWallet from '../components/modal/selectWallet'
import Loader from '../components/loader'
import Meta from '../components/meta'
import Header from '../components/header'
import Footer from '../components/footer'
import NotSupported from '../components/notSupported'

function Mint (props) {
  const router = useRouter()
  const {
    currentNetwork,
    network,
    openModal,
    locale,
    content
  } = props
  const contentParse = JSON.parse(content)
  const page = contentParse[locale]
  const [mode, setMode] = useState('light')
  const [loading, setLoading] = useState(false)
  const [inputDonate, setInputDonate] = useState(0)
  const [inputDonateError, setInputDonateError] = useState(false)
  const [mintApproved, setMintApproved] = useState(null)
  const [confetti, setConfetti] = useState(false)
  const [success, setSuccess] = useState(false)
  const { connector, library, chainId, account, activate, deactivate, active, error } = useWeb3React()
  const openModalWallet = () => {
    openModal({
      title: get(page, 'mint.modalSelectWallet', 'Select Wallet'),
      size: 'md',
      component: <SelectWallet />
    })
  }
  const checkCanMint = async () => {
    try {
      if (active) {
        const signer = library.getSigner()
        const contractMint = new ethers.Contract(currentNetwork.contracts.mint, abiEthereumMint, signer)
        const merkleTreeLeaves = merkleTree.split('\n')
        const merkleTreeFinal = new MerkleTree(merkleTreeLeaves, keccak256, { sort: true })
        const signerHash = utils.solidityKeccak256(['address'], [account])
        const proof = merkleTreeFinal.getHexProof(signerHash)
        const canMint = await contractMint.verifyMerkleLeaf(account, proof)
        setMintApproved(canMint)
      }
    } catch (error) {
      log.red(error)
    }
  }
  const mint = async () => {
    try {
      if (active) {
        const signer = library.getSigner()
        const contractMint = new ethers.Contract(currentNetwork.contracts.mint, abiEthereumMint, signer)
        const merkleTreeLeaves = merkleTree.split('\n')
        const merkleTreeFinal = new MerkleTree(merkleTreeLeaves, keccak256, { sort: true })
        const signerHash = utils.solidityKeccak256(['address'], [account])
        const proof = merkleTreeFinal.getHexProof(signerHash)
        const x = await contractMint.whiteListMint(proof)
        setLoading(true)
        await x.wait()
        setConfetti(true)
        setSuccess(true)
        setLoading(false)
      }
    } catch (error) {
      log.red(error)
    }
  }
  const donateAndMint = async () => {
    if (inputDonate <= 0) {
      setInputDonateError(true)
    } else {
      try {
        if (active) {
          setInputDonateError(false)
          const signer = library.getSigner()
          const contractMint = new ethers.Contract(currentNetwork.contracts.mint, abiEthereumMint, signer)
          const x = await contractMint.donateToUkraine({
            value: BigNumber.from(ethers.utils.parseUnits(inputDonate, 'ether'))
          })
          setLoading(true)
          await x.wait()
          setConfetti(true)
          setSuccess(true)
          setLoading(false)
        }
      } catch (error) {
        log.red(error)
      }
    }
  }
  useEffect(() => {
    checkCanMint()
  }, [account, currentNetwork])
  useEffect(() => {
    if (typeof window !== 'undefined' && document.body.classList.contains('light-mode')) {
      setMode('light')
    } else {
      setMode('dark')
    }
  }, [])
  if (active && !get(currentNetwork, 'services.mint')) {
    return (
      <div>
        <Meta
          title={get(page, 'notSupported.meta.title', '')}
          description={get(page, 'notSupported.meta.description', '')}
          image={get(page, 'notSupported.meta.image', '')}
          video={get(page, 'notSupported.meta.video', '')}
          url={router.pathname}
        />
        <Header page={page} transparent />
        <NotSupported page={page} chainId={chainId} network={network} service='mint' />
        <Footer page={page} />
      </div>
    )
  }
  return (
    <div>
      <Meta
        title={get(page, 'mint.meta.title', '')}
        description={get(page, 'mint.meta.description', '')}
        image={get(page, 'mint.meta.image', '')}
        video={get(page, 'mint.meta.video', '')}
        url={router.pathname}
      />
      <Header page={page} transparent />
      <div className='mw-100 mh-100 global-wrapper d-flex align-items-center justify-content-center'>
        <Confetti active={confetti} config={confettiConfig} />
        <div className='col-10 col-md-8 col-lg-6'>
          <div className='card shadow-lg border-0 rounded-lg'>
            <div className='card-body'>
              <h3 className='pt-0'>{get(page, 'mint.content.cardTitle')}</h3>
              <h5 className='p-0'>{get(page, 'mint.content.cardSubTitle')}</h5>
              <p>{get(page, 'mint.content.cardBody')}</p>
              <a href='https://opensea.io/collection/i-support-ukraine-verified-donation'><button className='btn btn-sm btn-pill btn-outline-primary'>{get(page, 'mint.content.cardBodyOpenSea')}</button></a>
            </div>
          </div>

          <div className='card shadow-lg border-0 rounded-lg mt-4'>
            {!success &&
              <div className='card-body d-flex align-items-center justify-content-center'>
                {loading && <div className='py-4'>
                  <Loader />
                </div>}
                {!loading && !active &&
                  <div className='p-4'>
                    <button className='btn btn-lg btn-pill btn-outline-primary' onClick={openModalWallet}>{get(page, 'mint.content.buttonConnectWallet')}</button>
                  </div>}
                {!isNil(mintApproved) && active && !loading && mintApproved &&
                  <div className='p-4'>
                    <button className='btn btn-lg btn-pill btn-outline-primary' onClick={mint}>{get(page, 'mint.content.buttonMint')}</button>
                  </div>}
                {!isNil(mintApproved) && active && !loading && !mintApproved &&
                  <div className='p-4 w-100'>
                    <div className='form-group mt-3 mb-0 w-100'>
                      <div className='input-outer input-outer-title'>
                        <div className='form-control'>{get(page, 'mint.content.buttonDonate')}</div>
                      </div>
                      <div
                        className={`input-outer ${inputDonateError && 'is-invalid'}`}
                      >
                        <input
                          className='form-control form-control-lg'
                          id='inputDonate'
                          pattern='[0-9.]*'
                          placeholder='0 ETH'
                          type='text'
                          value={inputDonate}
                          invalid={inputDonateError}
                          onChange={e => setInputDonate(e.target.validity.valid ? e.target.value : inputDonate)}
                        />
                        <div className='input-outer-form-group'>
                          <span>Min: 0.001 ETH</span>
                        </div>
                      </div>
                    </div>
                    <div className='d-flex w-100 justify-content-center mt-5'>
                      <button className='btn btn-lg btn-pill btn-outline-primary' onClick={donateAndMint}>{get(page, 'mint.content.buttonDonate')}</button>
                    </div>
                  </div>}
              </div>}
            {success &&
              <div className='card-body d-flex align-items-center justify-content-center'>
                <p className='mb-0'>{get(page, 'mint.content.cardBodySuccess')}</p>
              </div>}
          </div>

        </div>

      </div>
      <Footer page={page} />
    </div>
  )
}

export async function getServerSideProps (context) {
  return {
    props: {
      locale: context.locale,
      content
    }
  }
}

const mapStateToProps = state => ({
  currentAccount: state.global.currentAccount,
  currentNetwork: state.global.currentNetwork,
  network: state.global.network
})

const mapDispatchToProps = dispatch => ({
  openModal: (modal) => dispatch(openModal(modal))
})

export default connect(mapStateToProps, mapDispatchToProps)(Mint)
