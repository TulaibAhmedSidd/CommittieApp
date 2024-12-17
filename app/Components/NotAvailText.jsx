import React from 'react'

const NotAvailText = ({ text = 'No record available' }) => {
    // const { text } = props
    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex justify-center items-center w-full">
            {text}
        </div>
    )
}

export default NotAvailText