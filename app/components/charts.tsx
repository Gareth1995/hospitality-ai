"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import ChoroplethMapLegend from "./legend";
import {Spinner} from "@heroui/react";


const Charts = () => {


  const ChoroplethMap = dynamic(() => import("./choroplethMap"), { ssr: false });

  // Dynamically import feedback rate
  const CardDetails = useMemo(() => dynamic(() => import('./card_data'),
    {
        loading: () => <Spinner/>,
    }
  ), [])

  // Dynamically import ratings over time chart
  const RatingLineChart = useMemo(() => dynamic(() => import('./rating_line_chart'),
    {
        loading: () => <Spinner/>,
    }
  ), [])

  // Dynamically import sentiment over time chart
  const RoomTypeSentiment = useMemo(() => dynamic(() => import('./room_type_sentiment'),
    {
        loading: () => <Spinner/>,
    }
  ), [])

  return (
    <>
      <section>
        <div className="flex m-4 gap-2">
          <div className="flex-1 px-2 justify-center w-16 bg-[var(--card-bg-col)] shadow rounded h-300px">
            <div className="">
              <p className="text-[var(--card-text-col)]">Average Guest Rating</p>
              <div className="py-4 font-bold text-[var(--card-text-col)]"><CardDetails api_endpoint="avg-rating" datakey="average_rating"/></div>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16 bg-[var(--card-bg-col)] shadow rounded max-h-300px">
            <div className="">
              <p className="text-[var(--card-text-col)]">Sentiment</p>
              <div className="py-4 font-bold text-[var(--card-text-col)]"><CardDetails api_endpoint="modal-sentiment" datakey="sentiment"/></div>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16  bg-[var(--card-bg-col)] shadow rounded max-h-300px">
            <div className="">
              <p className="text-[var(--card-text-col)]">Feedback Rate</p>
              <div className="py-4 font-bold text-[var(--card-text-col)]"><CardDetails api_endpoint="get-feedback-rate" datakey="feedback_rate"/></div>
            </div>
          </div>
        </div>
      </section>

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

          
      {/* Rating over time line chart */}
      <section className="flex my-4 px-4 gap-3">
        <div className="w-full h-[500px] bg-[var(--card-bg-col)] rounded">
          <RatingLineChart/>
        </div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/2 h-[400px] bg-[var(--card-bg-col)] rounded">
          <RoomTypeSentiment/>
        </div>
        <div className=" w-1/2 h-[400px] bg-[var(--card-bg-col)] rounded">
          {/* <RoomTypeSentiment/> */}
        </div>
      </section>

      {/* <section className="flex my-4 px-4 gap-2 justify-center">
        <div className=" w-1/2 h-[400px] bg-[var(--card-bg-col)] rounded">
          <RoomTypeSentiment/>
        </div>
      </section> */}
    </>
  );
};

export default Charts;