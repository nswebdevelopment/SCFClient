
import '../App.css';
import React, { useState, useEffect} from 'react';
import ParcelList from '../components/ParcelList';
import  {ModalProvider}  from '../components/SaveParcelModal';
import Map from '../components/Map';

function Home() {

    const [parcels, addParcel] = useState([]);
    const [selectedParcel, setSelectedParcel] = useState(null);


    useEffect(() => {
      if (selectedParcel) {
        parcels.map((parcel) => {
          parcel.polygon.setOptions({ strokeWeight: 1 ,  strokeColor: "white",});
          return null;
        });

        selectedParcel.polygon.setOptions({ strokeWeight: 3 ,  strokeColor: "white"});
      }
    }, [selectedParcel, parcels]);

  return (


    
<div className='home' style={styles.container}>
<div style={{ display: 'flex', flexDirection: 'row', width: '100vw', overflow: 'hidden'}}>
        <ModalProvider>
        <Map parcels={parcels} addParcel={addParcel} selectedParcel={selectedParcel} setSelectedParcel={setSelectedParcel}/>
        </ModalProvider>
        <ParcelList parcels={parcels} setSelectedParcel={setSelectedParcel} selectedParcel= {selectedParcel}/>
        </div>
  </div>
  );
}

    const styles = {
        container: {
          position: 'absolute', // Position it relative to the parent
          left: 0, // Start from the left
          right: 0, // Stretch to the right
          top: 80, // Start from the top
          bottom: 0, // Stretch to the bottom
          backgroundColor: 'white', // Set the background color to blue
          overflow: 'hidden' // Hide the overflowing content
        },
      };

      // function Home() {
      //   return (
      //     <div className='home' style={styles.container}>
       
      //         <h1>Home</h1>
            
      //     </div>
      //   );
      // }



export default Home;