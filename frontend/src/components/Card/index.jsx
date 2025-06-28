import React from 'react'
import "./index.css"

const Card = ({title,children,maxWidth=450}) => {
  return (
    <div style={{maxWidth:maxWidth}} className='card'>
      {title?<h2 className='card__title'>{title}</h2>:null}
      <div className='card__content'>
      {children}
      </div>
    </div>
  )
}

export default Card