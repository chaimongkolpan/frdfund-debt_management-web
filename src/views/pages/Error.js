// ** React Imports
import { Link } from 'react-router-dom'

// ** Reactstrap Imports
import { Button } from 'reactstrap'
import { ArrowLeft } from 'react-feather'

import logo from '@src/assets/images/icons/logo.png'
import illustrationsDark from '@src/assets/images/pages/error-dark.svg'

// ** Styles
import '@styles/base/pages/page-misc.scss'

const Error = () => {
  const source = illustrationsDark

  return (
    <div className='misc-wrapper'>
      <a className='brand-logo' href='/'>
        <img className='fallback-logo' src={logo} alt='logo' width={36} height={36} />
        <h2 className='ms-2'>สํานักงานกองทุนฟื้นฟูและพัฒนาเกษตรกร</h2>
      </a>
      <div className='misc-inner p-2 p-sm-3'>
        <div className='w-100 text-center'>
          <h2 className='mb-1'>ไม่พบหน้าที่คุณต้องการ</h2>
          <p className='mb-2'>Oops! 😖 The requested URL was not found on this server.</p>
          <Button tag={Link} to='/' color='primary' className='btn-sm-block mb-2'>
            <ArrowLeft className='me-1' size={12} />กลับหน้าหลัก
          </Button>
          <img className='img-fluid' src={source} alt='Not authorized page' />
        </div>
      </div>
    </div>
  )
}
export default Error
