import React from "react";

const Hotelregistrationform = ({onClose}) => {

  const handlesubmit = async (e) => {
    e.preventDefault();

    // 1, gather data from the form 
    const formdata  = new FormData();
    formdata.append('name', e.target.propertyname.value);
    formdata.append('location', e.target.propertylocation.value);
    formdata.append('price', e.target.propertyprice.value);

    for (let i=0; i < e.target.propertyPhotos.files.length; i++) {
      formdata.append('photos', e.target.propertyPhotos.files[i]);
    }


    try {
    const response = await fetch('http://localhost:3000/api/properties', {
    method: 'post',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },  // <- ADD
    body: formdata,
    });

      const data = await response.json();
      if (response.ok) {
        alert('successfully created !');
        onClose();
      } else {
        alert('error: ' + data.message);
      }
    } catch (err) {
      console.error('Submission failed: ', err);
    }

  }



  return (
    // <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='relative bg-[#E9B949] p-10 md:p-14 rounded-4xl m-4 w-full max-w-xl shadow-xl border border-black'>
        {/* close button */}
        <button 
        type="button" 
        onClick={onClose} 
        className="absolute top-6 right-6 w-10 h-10 bg-[#064c3c] text-amber-300 rounded-full flex items-center justify-center font-bold text-lg hover:bg-emerald-900 transition-colors shadow-md cursor-pointer">X</button>

        <div className='bg-[#064c3c] p-8 md:p-10 rounded-4xl mb-6'>
          <p className='text-amber-300 font-bold text-lg md:text-xl'>New listing</p>
          <h1 className='text-2xl md:text-3xl font-extralight text-white mt-1'>Tell us about your place</h1>
          <p className='text-gray-300 text-sm mt-2'>Share your space with travelers from around the world.</p>
        </div>

        <form onSubmit= {handlesubmit} className="space-y-4">
          <div>
            <label className='block font-medium text-gray-900 mb-1'>Property name</label>
            <input 
              type="text" 
              placeholder='e.g., Mountain View Villa'
              name="propertyname"
              className='w-full bg-amber-50 border border-black rounded-2xl p-3 outline-none focus:ring-2 focus:ring-[#064c3c]' 
            />
          </div>

          <div>
            <label className='block font-medium text-gray-900 mb-1'>Location</label>
            <input 
              type="text" 
              placeholder='e.g., Kathmandu, Nepal'
              name="propertylocation"
              className='w-full bg-amber-50 border border-black rounded-2xl p-3 outline-none focus:ring-2 focus:ring-[#064c3c]' 
            />
          </div>

          <div>
            <label className='block font-medium text-gray-900 mb-1'>Nightly price (Rs)</label>
            <input 
              type="number" 
              placeholder='e.g., 1200'
              name="propertyprice"
              className='w-full bg-amber-50 border border-black rounded-2xl p-3 outline-none focus:ring-2 focus:ring-[#064c3c]' 
            />
          </div>

          <div>
            <label className='block font-medium text-gray-900 mb-1'>Property photos</label>
            <input 
              type="file" 
              name="propertyPhotos"
              accept="image/*"
              multiple
              className="w-full text-sm text-gray-700 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-black file:text-sm file:font-semibold file:bg-amber-50 file:text-[#064c3c] hover:file:bg-amber-100 bg-amber-50 border border-black rounded-2xl p-2 cursor-pointer"
            />
          </div>

          <button 
            type="submit"
            className='w-full bg-[#064c3c] text-amber-300 border border-black rounded-2xl p-3 mt-4 font-bold hover:bg-emerald-900 cursor-pointer transition-colors shadow-sm'
          >
            Create listing
          </button>
        </form>
      </div>
    // </div>
  );
};

export default Hotelregistrationform;