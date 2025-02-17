"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import ChoroplethMapLegend from "./legend";


const Charts = () => {


  const ChoroplethMap = dynamic(() => import("./choroplethMap"), { ssr: false });

  // Dynamically import average rating
  const AvgRating = useMemo(() => dynamic(() => import('./avgRating'),
    {
        loading: () => <p>Loading</p>,
    }
  ), [])

  // Dynamically import modal sentiment
  const ModalSentiment = useMemo(() => dynamic(() => import('./modalSentiment'),
    {
        loading: () => <p>Loading</p>,
    }
  ), [])

  return (
    <>
      <section>
        <div className="flex m-4 gap-2">
          <div className="flex-1 px-2 justify-center w-16 bg-[var(--card-bg-col)] shadow rounded h-300px">
            <div className="">
              <p className="text-[var(--card-text-col)]">Average Guest Rating</p>
              {/* <p className="py-4 font-bold text-[var(--card-text-col)]"><AvgRating/></p> */}
              <div className="py-4 font-bold text-[var(--card-text-col)]"><AvgRating /></div>
              {/* <p className="text-green-500">+34.5%</p> */}
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16 bg-[var(--card-bg-col)] shadow rounded max-h-300px">
            <div className="">
              <p className="text-[var(--card-text-col)]">Sentiment</p>
              {/* <p className="py-4 font-bold text-[var(card-text-col)]"> <ModalSentiment/> </p> */}
              <div className="py-4 font-bold text-[var(--card-text-col)]"><ModalSentiment /></div>
              {/* <p className="text-green-500">+34.5%</p> */}
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-[var(--card-bg-col)] shadow rounded max-h-300px">
            <div className="">
              <p className="text-[var(--card-text-col)]">Total subscriptions</p>
              <p className="py-4 font-bold text-[var(--card-text-col)]">$30,000 </p>
              <p className="text-green-500">+34.5%</p>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="flex my-4 px-4 gap-3">
        <div className="w-[90%] h-[500px] bg-[var(--card-bg-col)] rounded">
          <ChoroplethMap/>
        </div>
      </section> */}
      {/* Map and Legend Section */}
      <section className="flex my-4 px-4 gap-3">
        <div className="flex w-full gap-3">
          {/* Map Container */}
          <div className="relative flex-1 h-[500px] bg-[var(--card-bg-col)]">
            <ChoroplethMap />
            {/* Legend positioned at the bottom-left of the map */}
            <div className="absolute bottom-0 left-0 p-4">
              <ChoroplethMapLegend />
            </div>
          </div>
        </div>
      </section>

      {/* <section className="flex my-4 px-4 gap-3">
        <div className="flex w-[75%] h-[500px] bg-[var(--card-bg-col)] rounded">
          <ChoroplethMapLegend className="w-[300px] ml-3" />
          <ChoroplethMap className="flex-1" />
        </div>
      </section> */}

      

      <section className="flex my-4 px-4 gap-3">
        <div className="w-full h-[500px] bg-[var(--card-bg-col)] rounded">
          
        </div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/2 h-[250px] bg-[var(--card-bg-col)] rounded">
          {/* <DemographicsChart/>         */}
        </div>
        <div className=" w-1/2 h-[250px] bg-[var(--card-bg-col)] rounded"></div>
      </section>

      <section className="flex my-4 px-4 gap-2 justify-center">
        <div className=" w-1/2 h-[250px] bg-[var(--card-bg-col)] rounded"></div>
      </section>
    </>
  );
};

export default Charts;