import React from 'react'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardHeader,
  Container,
  Row
} from 'reactstrap'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { useRouter } from 'next/router'
// import { useHistory, useLocation } from 'react-router-dom'

import { closeModal } from '../../redux/action/global'

function ModalWrapper (props) {
  const {
    closeModal,
    content
  } = props
  const {
    active,
    title,
    size,
    hideClose,
    component
  } = props.modal
  const closeModalButton = () => {
    closeModal()
  }
  return (
    <Modal
      isOpen={active}
      centered
      size={size}
      className='global-modal'
    >
      <ModalHeader>
        <div className='d-flex align-items-center justify-content-between w-100'>
          <span>{title}</span>
          {!hideClose && <Button className='btn-pill' size='xs' onClick={closeModalButton}>X</Button>}
        </div>
      </ModalHeader>
      <ModalBody>
        {component}
      </ModalBody>
    </Modal>
  )
}

const mapStateToProps = state => ({
  modal: state.global.modal,
  content: state.global.content
})

const mapDispatchToProps = dispatch => ({
  closeModal: () => dispatch(closeModal())
})

export default connect(mapStateToProps, mapDispatchToProps)(ModalWrapper)
