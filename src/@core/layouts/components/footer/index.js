// ** Icons Import
import Logo from '@src/views/components/logo'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        COPYRIGHT © {new Date().getFullYear()}{' '}
        <a href='https://www.axonstech.com/' target='_blank' rel='noopener noreferrer'>
          AXONS
        </a>
        <span className='d-none d-sm-inline-block'>, All Rights Reserved</span>
      </span>
      <span className='float-md-end d-none d-md-block'>
        <Logo />
      </span>
    </p>
  )
}

export default Footer
