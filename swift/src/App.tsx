function App() {
  return (
    <div className="fixed inset-0 w-full h-full bg-main bg-no-repeat bg-cover bg-center flex justify-center items-center flex-col">
      <div className="absolute top-16 left-16">
        <div className="font-serif text-center">
          <h1 className="text-8xl font-semibold tracking-widest">Swift</h1>
          <h6 className="text-xl tracking-widest">Conferencing made simple</h6>
        </div>
      </div>
      <div className="text-white text-sm font-serif mb-2 bg-opacity-75 bg-black rounded-sm px-2 py-1">
        Active Rooms: <span className="font-bold">3</span>
      </div>
      <button className="bg-gray-50 bg-opacity-75 text-gray-800 px-8 py-3 rounded-sm font-serif text-xl tracking-wide focus:outline-none active:scale-95 hover:bg-black hover:text-white transition-all duration-500 transform">
        Join Now
      </button>
    </div>
  );
}

export default App;
