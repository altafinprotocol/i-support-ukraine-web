import React from 'react'
import get from 'lodash/get'

function Footer (props) {
  const {
    page
  } = props
  return (
    <footer className='d-flex align-items-center justify-content-between w-100 px-3'>
      <div />
      <p className='p-0 m-0 text-size-xs'>
        {get(page, 'footer.text')} | <a href='https://discord.gg/Xkcj95p2Gx' className='text-size-xs'>{get(page, 'footer.textLink')}</a>
      </p>
    </footer>
  )
}

export default Footer
