export default function Home() {
  return (
    <div className="w-full h-full p-4 md:p-20 flex flex-col justify-start">
      <div className="w-full md:h-full rounded-4xl  bg-accent p-2 flex flex-col items-center">
        {/* MAIN TEXT */}
        <div className="flex flex-col flex-grow justify-center items-center">
          <div className="text-6xl my-10 md:text-8xl font-black space-x-4">
            Is that a<br />
            red flag?
          </div>
        </div>
        {/* ILLUSTRATION */}
        <div className="p-4 md:p-0 grid place-items-center">
          <img
            src="/main_image.png"
            alt="Main Illustration"
            className="w-[80%] md:w-[25rem] h-auto"
          />
        </div>
      </div>
    </div>
  );
}
