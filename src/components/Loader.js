import {ThreeDots} from 'react-loader-spinner';

// FullScreenLoader component
function FullScreenLoader() {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex:1000 // semi-transparent background
      }}>
        <ThreeDots color="#028361" height={80} width={80} />
      </div>
    );
  }

  export default FullScreenLoader;
