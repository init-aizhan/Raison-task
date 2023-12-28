import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import axios from 'axios';
import { FormInput } from './App';

interface ProceedLoginPageProps {}

const ProceedLoginPage: React.FC<ProceedLoginPageProps> = () => {
  const history = useHistory();
  const location = useLocation();

  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [popupContent, setPopupContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);


  const email = (location.state as { email: string } | undefined)?.email || 'No email provided';

  const handleBack = () => {
    history.goBack();
  };

  const handleConfirm = async () => {
    try {
      setLoading(true); 
      const response = await axios.post('/api/endpoint', { email });

      setPopupContent('Success!');
      setShowPopup(true);
    } catch (error) {
      setPopupContent('Error!');
      setShowPopup(true);
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="flex flex-col justify-between p-4 h-full">
      <FormInput value={email} readOnly={false} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
              throw new Error('Function not implemented.');
          } } />

      <div className="p-1"></div>
      <div className='flex w-full gap-2'>
      <button onClick={handleBack} className="btn bg-gray-400 w-1/2">
        Back
      </button>
      <button onClick={handleConfirm} className="btn btn-primary w-1/2" disabled={loading}>
        Confirm
      </button>
      </div>


      {loading && <Loader/>}


{showPopup && <Popup content={popupContent} onClose={closePopup} />}
    </div>
  );
};

export default ProceedLoginPage;

interface PopupProps {
    content: string;
    onClose: () => void;
  }

function Popup({ content, onClose }: PopupProps) {
    return(     <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div className="bg-white p-4 rounded">
      <p>{content}</p>
      <button onClick={onClose} className="btn bg-gray-400 w-full">
        &lt;
      </button>
    </div>
  </div>)
}

function Loader() {
    return(
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-4 rounded">
          <div className="loader">Loading...</div>
        </div>
      </div>
    )
}