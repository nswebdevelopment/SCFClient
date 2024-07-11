import {ThreeDots} from 'react-loader-spinner';
import '../styles/Loader.css';

// FullScreenLoader component
function FullScreenLoader() {
    return (
      <div className='container'>
        <ThreeDots  height={80} width={80} />
      </div>
    );
  }

  export default FullScreenLoader;
