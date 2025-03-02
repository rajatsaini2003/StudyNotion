import React from 'react'
import IconButton from './IconButton'

const ConfirmationModal = ({modalData}) => {
  return (
    <div>
      <div>
        <p>
            {modalData.text}
        </p>
        <p>
            {modalData.text2}
        </p>
        <div>
            <IconButton
            onClick={modalData.btn1Handler}
            text={modalData.btn1Text} 
            />
            <button
            onClick={modalData?.btn2Handler}>
              {modalData.btn2Text}
            </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
