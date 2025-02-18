// Popup component that will show up when you click a country on the map

import React from 'react';
import { Spinner } from '@heroui/react';

const ReviewModal = ({ reviews, isOpen, onClose, positionX = '50%', positionY = '50%', country, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div
        className="bg-[var(--card-bg-col)] rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6"
        style={{
          left: `${positionX}px`,
          top: `${positionY}px`,
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Customer Reviews From {country || 'Unknown Country'}</h2>
          <button onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center">
              <Spinner />
            </div>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="mb-4">
                <p className="font-semibold">{review.reviewer_name}</p>
                <p>{review.review_text}</p>
                {review.review_rating && (
                  <div className="flex items-center mt-2">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span>{review.review_rating ? review.review_rating : 'NA'}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews available for this country.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
