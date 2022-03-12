import React from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'

import { closeModal } from '../../redux/action/global'

function ProhibitedCountry (props) {
  const {
    prohibitedCountry,
    page
  } = props
  return (
    <div>
      <div className='w-100 p-3'>
        <h5 className='p-0'>{get(page, 'fields.prohibitedCountryHeading', 'Thank you for your interest')}</h5>
        <p className='mb-0'>{get(page, 'fields.prohibitedCountrySubHeading', 'Access is not authorized due to your geographic location.')}</p>
        <span className='badge badge-dark my-3 badge-lg font-weight-bold p-2'>{prohibitedCountry}</span>
        <div className='d-flex w-100 justify-content-end mt-3'>
          <a href='https://altafin.co/legal/terms-of-use'><button className='btn btn-pill btn-outline-primary'>{get(page, 'fields.termsOfUse', 'Terms of Use')}</button></a>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  prohibitedCountry: state.global.prohibitedCountry
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProhibitedCountry)
