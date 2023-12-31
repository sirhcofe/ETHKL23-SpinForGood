import React from "react";
import { motion } from "framer-motion";

// interface BackdropProps extends React.HTMLProps<HTMLDivElement> {
//     show:
// }
const Backdrop = ({ children, onClick }: { children: any; onClick: any }) => {
  return (
    <motion.div
      onClick={onClick}
      className={` z-50 top-0 left-0 h-screen w-screen absolute flex justify-center items-center bg-zinc-900/50 }`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

export default Backdrop;
