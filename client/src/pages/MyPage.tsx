import { useEffect } from 'react';
import BackButton from '../components/common/BackButton';
import './MyPage.scss';
const MyPage = () => {
  useEffect(()=> {
      console.log('hi')
  })
  return (
    <div className='myPage'>
        <BackButton />
        
    </div>
  );
};

export default MyPage;

