// ** Logo
import logo from '@src/assets/images/icons/logo.png'
import { Spinner } from 'reactstrap'

const SpinnerComponent = () => {
  return (
    <div className='fallback-spinner app-loader'>
      <img className='fallback-logo mb-5' src={logo} alt='logo' width={200} height={200} />
      <Spinner style={{ height: '3rem', width: '3rem' }} />
    </div>
  )
}

export default SpinnerComponent
