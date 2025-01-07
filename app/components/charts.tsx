'use client'
const Charts = () => {
  return (
    <>

<section>
        <div className="flex m-4 gap-2">
          <div className="flex-1 px-2 justify-center w-16 bg-[var(--card-bg-col)] shadow rounded h-300px">
            <div className="">
              <p className="text-[var(--card-text-col)] font-bold">Total returns</p>
              <p className="py-4 font-bold text-[var(--card-text-col)]">$30,000 </p>
              <p className="text-green-500">+34.5%</p>
            </div>
          </div>
          <div className="flex-1 px-2 justify-center w-16 bg-[var(--card-bg-col)] shadow rounded max-h-300px">
            <div className="">
              <p className="text-[var(--card-text-col)]">Total sales</p>
              <p className="py-4 font-bold text-[var(card-text-col)]">$30,000 </p>
              <p className="text-green-500">+34.5%</p>
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

      <section className="flex my-4 px-4 gap-3">
        <div className="w-full h-[300px] bg-[var(--card-bg-col)] rounded"></div>
      </section>

      <section className="flex my-4 px-4 gap-3">
        <div className="w-full h-[300px] bg-[var(--card-bg-col)] rounded"></div>
      </section>

      <section className="flex my-4 px-4 gap-2">
        <div className=" w-1/2 h-[250px] bg-[var(--card-bg-col)] rounded"></div>
        <div className=" w-1/2 h-[250px] bg-[var(--card-bg-col)] rounded"></div>
      </section>

      <section className="flex my-4 px-4 gap-2 justify-center">
        <div className=" w-1/2 h-[250px] bg-[var(--card-bg-col)] rounded"></div>
      </section>
    </>
  );
};

export default Charts;