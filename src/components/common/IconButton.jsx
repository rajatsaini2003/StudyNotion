import React from 'react'

const IconButton = ({
    text,
    onClick,
    children,
    disabled,
    outline=false,
    customClasses,
    type
}) => {
  return (
    <button
    disabled={disabled}
    onClick={onClick}
    type={type}
    >
      {
        children ?(
            <>
                <span>
                    {text}
                </span>
                {children}
            </>
        ):(text)
      }
    </button>
  )
}

export default IconButton
