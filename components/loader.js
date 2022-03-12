import React from 'react'

function Loader () {
  var inner = []
  for (let i = 0; i < 25; i++) {
    inner.push('+')
  }
  if (inner.length > 0) {
    return (
      <div className='loader'>
        {inner.map(count => <div key={`${Math.random()}${count}`} className='dot' />)}
      </div>
    )
  }
  return (<div />)
}

export default Loader
