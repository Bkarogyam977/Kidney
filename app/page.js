'use client';
import { FaAngleDoubleRight } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import axios from 'axios';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const truncateDescription = (description, maxWords) => {
  const words = description.split(' ');
  return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : description;
};


export default function Home() {

  const [salesData, setSalesData] = useState(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://www.bkarogyam.com/lapisarogyamission/');
        const data = response.data[1];
        setSalesData(data);
        setTimeLeft(calculateTimeLeft(data.end_time));
      } catch (error) {
        console.error('Error fetching sales page data:', error);
      }
    };

    fetchData();

    const timer = setInterval(() => {
      if (salesData) {
        setTimeLeft(calculateTimeLeft(salesData.end_time));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [salesData]);


  // Calculate time left until the end time
  const calculateTimeLeft = (endTime) => {
    const difference = new Date(endTime) - new Date();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };


  // Convert YouTube video link to an embeddable link
  const getEmbedLink = (link) => {
    return link.replace('watch?v=', 'embed/');
  };


  // Pagination settings for Swiper
  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    },
  };

  if (!salesData) {
    return <div>Loading...</div>;
  }


  return (
    <div className='bg-white'>
      <div className='bg-blue-950'>
        <p className='md:text-5xl text-3xl text-white font-bold md:px-7 px-2 pt-7 text-center'>
          <span className='text-yellow-400'>{salesData.title}</span>
        </p>

        <p className='text-sm px-4 md:px-40 text-white font-bold text-center italic mt-5'>
          {truncateDescription(salesData.sort_description)}
        </p>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:px-20 mt-5">
          {/* Left Column */}
          <div className="border p-6 rounded shadow text-center">
            <h2 className='text-2xl font-bold mb-4 text-white'>📢 {salesData.seats_and_video_sections[0].title}</h2>
            <p className='text-xl mb-2 text-yellow-500 font-bold'>{salesData.seats_and_video_sections[0].offers}</p>
            <button className='bg-green-500 text-white px-5 py-1 rounded mb-4 mt-3'>
              {salesData.book_now_text}
            </button>
            <p className='text-2xl font-bold mb-5 text-white'>Date & Time - {salesData.seats_and_video_sections[0].datetime_remaining}</p>
            <p className='text-sm font-bold text-white' dangerouslySetInnerHTML={{ __html: salesData.seats_and_video_sections[0].description }} />

          </div>

          {/* Right Column with Embedded YouTube Video */}
          <div className="video-container rounded mb-2">
            <iframe
              src={getEmbedLink(salesData.seats_and_video_sections[0].video_link)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="iframe"
            ></iframe>
          </div>

          <style jsx>{`
            .video-container {
              position: relative;
              width: 100%;
              padding-top: 56.25%; /* 16:9 aspect ratio */
            }
            .iframe {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          `}</style>
        </div>


        {/* What You Will Learn Section */}
        <div className='md:p-6 p-2 bg-white'>
          <h2 className='text-3xl font-bold text-black mb-4 text-center'>What You Will Learn in This Workshop</h2>
          <ul className='list-none space-y-3 md:px-28 px-2'>
            {salesData.what_you_will_learn.map((item, index) => (
              <li key={index} className='flex items-start text-sm text-black'>
                {/* Forward Icon */}
                <FaAngleDoubleRight className="w-6 h-6 text-green-500 mr-2" aria-hidden="true" />
                <div>
                  <strong>{item.title}:</strong> {item.description}
                </div>
              </li>
            ))}
          </ul>
        </div>


        {/* testtt */}
        <div className='text-center py-5'>
          {salesData?.achiveing?.[0]?.achiving_content ? (
            <div
              className='md:px-40 md:p-5 md:text-xl font-bold'
              dangerouslySetInnerHTML={{ __html: salesData.achiveing[0].achiving_content }}
            />
          ) : (
            <p className='md:px-40 p-5 text-xl font-bold'>No content available.</p>
          )}

          <button className='bg-green-500 text-white px-5 py-1 rounded mb-4 md:mt-3 mt-5'>
            {salesData?.book_now_text || 'Book Now'}
          </button>
        </div>


        {/* our achivement */}
        <div className="text-center bg-black md:py-20 py-10 md:px-10 px-5">
          <p className="md:text-5xl text-3xl font-bold mb-10 text-white">
            Our Achievements Experience
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <div className="border-r last:border-r-0 pr-4">
              <p className="text-2xl md:text-3xl font-bold text-white">
                {salesData.our_achievements[0]?.Experience_in_years}
              </p>
            </div>
            <div className="border-r last:border-r-0 pr-4">
              <p className="text-2xl md:text-3xl font-bold text-white">
                {salesData.our_achievements[0]?.patent_treated}
              </p>
            </div>
            <div className="border-r last:border-r-0 pr-4">
              <p className="text-2xl md:text-3xl font-bold text-white">
                {salesData.our_achievements[0]?.sticfied_patents}
              </p>
            </div>
            <div className="border-r last:border-r-0 pr-4">
              <p className="text-2xl md:text-3xl font-bold text-white">
                {salesData.our_achievements[0]?.contries}
              </p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {salesData.our_achievements[0]?.languages}
              </p>
            </div>
          </div>
        </div>

        {/* About me */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:py-14 py-7 bg-white md:px-20 px-2">
          {/* Right Column: Image (show on top for mobile views) */}
          <div className="flex justify-center items-center order-1 md:order-2">
            <img
              src={salesData.aboutme.image}
              alt={salesData.aboutme.name}
              className="w-auto h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Left Column: Content (show below image on mobile views) */}
          <div className="md:text-left text-center order-2 md:order-1">
            <h2 className="text-3xl font-bold text-red-900">{salesData.aboutme.name}</h2>
            <p className="text-lg font-semibold mb-4 text-black mt-3">{salesData.aboutme.title}</p>
            <div
              className="md:text-lg text-sm mb-4 px-3 text-black"
              dangerouslySetInnerHTML={{ __html: salesData.aboutme.description }}
            />
          </div>
        </div>



        {/* Social Media Reviews */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 bg-white md:px-20 px-4 md:pb-14 pb-5'>
          {salesData.social_patent_reviews.map((review, index) => (
            <div key={index} className="flex justify-center items-center">
              <img
                src={review.image} // Dynamically load images from API
                alt={`Social Review ${index + 1}`} // Use dynamic alt text
                className="w-auto h-auto rounded-lg shadow-lg" // Adjust width and height as needed
              />
            </div>
          ))}
        </div>



        {/*center banner slider  */}
        <div className='bg-white'>
          <Swiper
            pagination={pagination}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {salesData.slider_image.map((imageData, index) => (
              <SwiperSlide key={index}>
                <img
                  src={imageData.image} // Dynamically load images from API
                  alt={`Slide ${index + 1}`} // Use dynamic alt text
                  className="w-full h-auto object-cover"
                />
              </SwiperSlide>
            ))}

          </Swiper>

          <style jsx>{`
        .mySwiper {
          width: 100%;
          height: 300px; /* Set a fixed height for the Swiper */
        }

        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18px;
          background: #fff;
        }

        .swiper-slide img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .swiper-pagination-bullet {
          width: 20px;
          height: 20px;
          text-align: center;
          line-height: 20px;
          font-size: 12px;
          color: #000;
          opacity: 1;
          background: rgba(0, 0, 0, 0.2);
        }

        .swiper-pagination-bullet-active {
          color: #fff;
          background: #007aff;
        }
      `}</style>
        </div>



        {/* Google reviews */}
        <div className="md:py-20 py-5 bg-white md:px-20 px-4">
          <p className='text-black md:text-5xl text-3xl font-bold text-center'>See What Others Talk About Us</p>

          {/* Grid Container */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"> {/* Set gap to your desired value */}
            {salesData.google_patent_reviews.map((review, index) => (
              <div className="flex justify-center" key={index}>
                <img
                  src={review.image} // Load image from API
                  alt={`Review ${index + 1}`} // Dynamic alt text
                  className="w-full h-auto rounded-lg shadow-lg" // Use full width and fixed height
                />
              </div>
            ))}
          </div>
        </div>



        <div className="bg-white md:px-20 px-5 pb-10">
          {/* Grid Container */}
          <div className="grid grid-cols-3 gap-4">
            {salesData.patent_review_video.map((video, index) => (
              <div className="flex flex-col items-center" key={index}>
                <iframe
                  width="100%" // Ensure full width for responsiveness
                  height="250" // Adjusted for mobile views
                  src={`https://www.youtube.com/embed/${new URL(video.video_link).searchParams.get('v')}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-xl mb-2"
                ></iframe>
                <p className="md:text-xl text-sm font-semibold text-black text-center">{video.desination}</p>
                <p className="text-red-900 md:text-xl text-sm font-bold mt-2 text-center">{video.name}</p>
                <p className="mt-2 text-center md:text-xl text-sm">⭐⭐⭐⭐⭐</p>
              </div>
            ))}
          </div>
        </div>



        {/* Testimonials Section */}
        <div className="testimonial-section md:p-10 bg-blue-500 md:px-[5em] p-5">
          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{
              clickable: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                slidesPerView: 2,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            modules={[Pagination, Autoplay]}
            className="mySwiper"
          >
            {salesData.patent_testimonials && salesData.patent_testimonials.length > 0 ? (
              salesData.patent_testimonials.map((testimonial, index) => (
                <SwiperSlide key={index} className="p-4">
                  <div
                    className="border border-gray-300 rounded-lg shadow-lg p-5 bg-blue-500 text-center"
                    style={{ minHeight: '400px', maxHeight: '500px' }}
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <h4 className="text-lg font-bold mb-2 text-white">{testimonial.name}</h4>
                    <p className="text-sm italic mb-4 text-white">
                      &quot;{truncateDescription(testimonial.description, 50)}&quot;
                    </p>
                    <div className="flex justify-center items-center mb-2 space-x-2">
                      <div className="flex">
                        {[...Array(testimonial.stars)].map((_, index) => (
                          <span key={index} className="text-yellow-500 text-xl">★</span>
                        ))}
                        {[...Array(5 - testimonial.stars)].map((_, index) => (
                          <span key={index} className="text-white">★</span>
                        ))}
                      </div>
                      <p className="text-sm font-semibold text-white">{testimonial.rating ? testimonial.rating : "No ratings"}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))
            ) : (
              <SwiperSlide>
                <div className="text-center p-6">
                  <p className="text-white">No testimonials available.</p>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>


        <div className='text-center md:py-20 py-10'>
          {/* Check if salesData and time_count_down are defined and have data */}
          {salesData?.time_count_down?.length > 0 && (
            <>
              {/* Heading */}
              <h2 className='md:text-5xl text-2xl font-bold mb-4 text-white'>
                {salesData.time_count_down[0].title}
              </h2>

              <p className='text-2xl mb-2 text-yellow-400'>
                {salesData.time_count_down[0].heading}
              </p>

              {/* Quote and Call-to-Action */}
              <blockquote className='italic mb-4 text-white md:px-[15em]'>
                {salesData.time_count_down[0].sort_description}
              </blockquote>

              {/* Countdown Display */}
              <div className="text-3xl font-bold mb-4 text-white">
                <span>{String(timeLeft.days).padStart(2, '0')}:</span>
                <span>{String(timeLeft.hours).padStart(2, '0')}:</span>
                <span>{String(timeLeft.minutes).padStart(2, '0')}:</span>
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              </div>

              {/* Book Now Button */}
              <a
                href={salesData.book_now_link}
                className="bg-green-500 text-white px-5 py-2 rounded mb-4 mt-3 hover:bg-green-600 transition-colors"
              >
                {salesData.book_now_text}
              </a>

              <p className="text-lg font-bold text-white mt-4">
                Register NOW and Unlock Bonuses Worth Rs. 5,000!
              </p>
            </>
          )}
        </div>





        <div className="bg-white py-8 md:px-20 px-2 shadow-lg">
          <h2 className="md:text-5xl text-2xl text-black text-center font-bold mb-6 md:px-40">
            As Special Bonuses Worth During Live Training You Will Get... :
          </h2>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
            {salesData.special_bonus.map((bonus, index) => (
              <div key={index} className="md:p-6 p-2">
                <h3 className="text-3xl text-red-900 italic underline font-bold mb-2 text-center">
                  {bonus.title}
                </h3>
                <h4 className="text-xl font-semibold mb-4 text-black mt-5">{bonus.heading}</h4>
                {bonus.description ? (
                  <p className="text-lg text-black mb-4">{bonus.description}</p>
                ) : (
                  <p className="text-lg text-black mb-4">No description available.</p>
                )}
              </div>
            ))}
          </div>


          <div className='md:py-10 py-5'>
            <h2 className="md:text-5xl text-2xl font-bold mb-4 text-center text-black">Frequently Asked Questions</h2>
            <Collapse defaultActiveKey={['1']}>
              {salesData.frequently_asked_question.map((item, index) => (
                <Panel
                  header={
                    <div className="bg-green-900 text-white p-2 rounded cursor-pointer hover:bg-green-600">
                      {item.question}
                    </div>
                  }
                  key={index + 1}
                >
                  <p>{item.answer}</p>
                </Panel>
              ))}
            </Collapse>
          </div>


          <div className="flex justify-center items-center md:pb-10 md-2">
            <a
              href={salesData.book_now_link}
              className="bg-yellow-500 text-white md:px-[20em] py-2 rounded mb-4 mt-3 hover:bg-green-600 transition-colors"
            >
              {salesData.book_now_text}
            </a>
          </div>

        </div>

        <div className="md:py-10 py-5 px-5 md-px-0 bg-blue-950 text-white flex flex-col items-center justify-center">
          <h2 className="md:text-5xl font-bold mb-2 text-center">Reserve Your Spot Now</h2>
          <p className="text-xl mb-4 text-center italic">HURRY UP! REGISTRATION WILL CLOSE SOON!</p>
          <blockquote className="italic text-center max-w-lg mb-6">
            &quot;If you do what you&apos;ve always done, you&apos;ll get what you&apos;ve always gotten.&apos;
          </blockquote>
          <button className="relative inline-block px-8 py-3 text-white font-semibold rounded-lg overflow-hidden bg-gradient-to-r from-[#ff7e5f] to-[#feb47b] group">
            <span className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-300 ease-in-out"></span>
            <span className="relative z-10">Reserve Your Spot</span>
          </button>
        </div>

        <div className='bg-black'>
          <p className='text-white text-center md:text-[12px] text-[7px] md:px-40 px-2 md:py-10 py-3'>
            <span className='text-l text-black font-bold'>Disclaimer:</span> This website is not affiliated with any third-party platform or entity, including Facebook or Meta Platforms, Inc. We also want to make clear that this site is not endorsed by Facebook or Instagram in any way. The terms ‘Facebook’ and ‘Instagram’ are registered trademarks of Meta Platforms, Inc.

            At BK Arogyam Pvt Ltd, we are committed to representing our services accurately, particularly with respect to potential results from our offerings. However, we make no guarantees regarding the outcomes or success you may achieve. Results can vary significantly depending on individual factors such as effort, experience, and expertise. Statements of potential earnings are based on estimates and do not guarantee a specific level of success.

            Testimonials featured on our site are examples of exceptional results, and these may not reflect the typical results experienced by other customers. Success in any endeavor requires a combination of dedication, background, and motivation, and as such, we cannot assure that past performance can be replicated in the future. Additionally, there are inherent risks in any business, including unforeseen challenges that may affect outcomes.

            By using our information, services, or products, you acknowledge that you are responsible for your own actions and results. We are not liable for the outcomes of your business decisions that are based on the information provided by us.

            <strong>Contact Us:</strong> If you have any questions regarding this disclaimer or how we handle your dealings with our site, feel free to reach out at support@bkarogyam.com.
            <span className="block mt-2">Privacy Policy | Terms and Conditions</span>
          </p>

        </div>
      </div>



    </div>
  );
}
