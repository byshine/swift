import { motion } from "framer-motion";
import { Link } from "react-router-dom";

function Home() {
  const variant = {
    show: {
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1,
      },
    },
    hide: {
      opacity: 0,
    },
    exit: {
      opacity: 0,
    },
  };

  const headerVariant = {
    show: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        duration: 1.5,
        delay: 0.5,
      },
    },
    hide: {
      x: -50,
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={variant}
      initial="hide"
      exit="exit"
      animate="show"
      className="fixed inset-0 w-full h-full bg-main bg-no-repeat bg-contain bg-center flex justify-center items-center flex-col"
    >
      <div className="absolute top-16 left-16">
        <motion.div variants={headerVariant} className="font-serif text-center">
          <h1 className="text-8xl font-semibold tracking-widest">Swift</h1>
          <h6 className="text-xl tracking-widest">Conferencing made simple</h6>
        </motion.div>
      </div>
      <div className="text-white text-sm font-serif mb-2 bg-opacity-75 bg-black rounded-sm px-2 py-1">
        Active Rooms: <span className="font-bold">3</span>
      </div>
      <Link to="/join">
        <button className="bg-gray-50 bg-opacity-75 text-gray-800 px-8 py-3 rounded-sm font-serif text-xl tracking-wide focus:outline-none active:scale-95 hover:bg-black hover:text-white transition-all duration-500 transform">
          Join Now
        </button>
      </Link>
    </motion.div>
  );
}

export default Home;
