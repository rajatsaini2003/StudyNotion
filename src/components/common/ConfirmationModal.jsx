import React from 'react'

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
      </div>
    </div>
  )
}

export default ConfirmationModal
