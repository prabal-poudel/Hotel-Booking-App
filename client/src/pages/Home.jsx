import React from 'react'
import Hero from '../components/Hero'
import HotelCard from '../components/HotelCard'

const Home = () => {
  return (
    <>
        <Hero />
        <p className='text-green-300 font-bold text-3xl p-2'>Curated for you</p>
        <div className='p-1 m-2 flex justify-between'>
        <h1 className='text-2xl text-amber-300 font-bold italic '>Places you’ll want to tell people about</h1>
        <button className='bg-blue-500 p-3  text-white rounded-3xl'>Search all Hotels</button>
        </div>
        <div>
          <p className='ml-4 font-bold text-gray-500'>highlighted exceptional stays</p>
          <div className='flex flex-wrap '> 
          <HotelCard hotel={{
            name: "Kathmandu",
            description: "Discover the heart of Nepal, where ancient temples, rich culture, historic landmarks, and vibrant city life come together.",
            img: "https://cdn.pixabay.com/photo/2014/11/15/23/29/fairytale-532850_1280.jpg",
            imgname: "kathmandu",
            price: "NPR 1200" 
            }}/>

          <HotelCard hotel={{
            name: "Phokhara",
            description: "Experience the beauty of Nepal's paradise, surrounded by breathtaking mountains, peaceful lakes, stunning waterfalls, and unforgettable adventures.",
            img: "https://cdn.pixabay.com/photo/2022/03/20/15/40/nature-7081138_1280.jpg",
            imgname: "Pokhara img",
            price: "NPR 1000"
            }}/>

          <HotelCard hotel={{
            name: "Biratnagar",
            description: "Explore one of eastern Nepal's vibrant cities, known for its lively atmosphere, local culture, delicious food, and welcoming communities.",
            img: "https://cdn.pixabay.com/photo/2026/04/20/02/43/02-43-00-298_1280.jpg",
            imgname: "Biratnagar img",
            price: "NPR 1100"
            }}/>

          <HotelCard hotel={{
              name: "Chitwan",
              description: "Explore the beautiful Chitwan National Park, wildlife, and lush green forests.",
              img: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
              imgname: "Chitwan National Park",
              price: "NPR 900"
          }}/>

          <HotelCard hotel={{
              name: "Lumbini",
              description: "Visit the birthplace of Gautama Buddha and experience peace and spirituality.",
              img: "https://images.pexels.com/photos/32468667/pexels-photo-32468667.jpeg",
              imgname: "Lumbini",
              price: "NPR 850"
          }}/>

          <HotelCard hotel={{
              name: "Mustang",
              description: "Discover the stunning Himalayan landscapes, mountains, and beautiful villages of Mustang.",
              img: "https://images.unsplash.com/photo-1768160686725-041f271eab72?auto=format&fit=crop&fm=jpg&q=80&w=1200",
              imgname: "Mustang",
              price: "NPR 750"
          }}/>
          </div>
        </div>
    </>
  )
}

export default Home