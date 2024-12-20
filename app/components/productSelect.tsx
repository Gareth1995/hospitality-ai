import React from 'react'
import AddToCart from './addToCart'
import { My_Soul } from 'next/font/google'
// import styles from './productSelect.module.css'

const ProductSelect = () => {
  return (
    // <div className={'p-5 my-5 bg-sky-400 hover:bg-sky-950' }> {/* Can use tailwind commands for styling instead of calling css file */}
    //     <AddToCart/>
    // </div>

    <div>
        <AddToCart/>
    </div>
  )
}

export default ProductSelect