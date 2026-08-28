"use client"
import React from 'react'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader


function Hero() {
  return (
    <div className='mt-5 container mx-auto'>
            <Carousel autoPlay infiniteLoop interval={2000} showThumbs={false}  >
                <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQratYG7xa8EIZXd_kZhX0bS8jYyDkwMDVjTberdrnFoZkGQFsBHMWxRC2J&s=10" />
                    
                </div>
                <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9H0AbwJyEGPF-3Eb22Ia5kp9xnxQRxgPZqIgimVZcZ-3DN-W324CdUps&s=10" />
                
                </div>
                <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxxhAgbYpTxsW7DlUecKsWE9rG4z4fRzZg2qqtcrDPR_JQjq0NXXHeOG0&s=10" />
                   
                </div>
            </Carousel>
    </div>
  )
}

export default Hero