import { useState } from "react";

export let viñetasGlobal = 0;

const Viñetas = () => {
  const [viñetas, setViñetas] = useState<number>(0);
  viñetasGlobal = viñetas;
  console.log(viñetas);
  const elemento = [];
  for (let i = 0; i < viñetas; i++) {
    elemento.push(
      <div
        key={i}
        className="relative flex bg-stone-900 border-2 border-stone-600 w-30 h-30 rounded-full items-center justify-center mx-5 mb-5"
      >
        <svg
          className="fill-white size-10 hover:bg-stone-600 absolute top-0 right-0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z" />
        </svg>
        <span className="text-white text-5xl">{i + 1}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <div className="flex flex-row w-full">
        <div className="flex basis-1/2 h-24 justify-center items-center">
          <button
            className="m-2 px-5 py-3 rounded-full hover:bg-stone-800"
            onClick={() => setViñetas(viñetas + 1)}
          >
            <svg
              className="fill-white size-15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z" />
            </svg>
          </button>
        </div>
        <div className="flex basis-1/2 h-24 justify-center items-center">
          <button
            className="m-2 px-5 py-3 rounded-full hover:bg-stone-800"
            onClick={() => setViñetas(viñetas - 1)}
          >
            <svg
              className="fill-white size-15"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 justify-center overflow-y-auto max-h-[860px]">
        {elemento.map((item) => item)}
      </div>
    </div>
  );
};
export default Viñetas;

