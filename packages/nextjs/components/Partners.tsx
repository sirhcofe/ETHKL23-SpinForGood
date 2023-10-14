import { useRef } from "react";
import Image from "next/image";
import { MotionValue, motion, useScroll, useSpring, useTransform } from "framer-motion";

const loremIpsum =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Diam phasellus vestibulum lorem sed risus ultricies tristique nulla aliquet. Enim ut tellus elementum sagittis vitae et leo duis ut. Vitae ultricies leo integer malesuada nunc vel risus commodo viverra. Tortor dignissim convallis aenean et tortor at risus viverra adipiscing. In ornare quam viverra orci. Ut tortor pretium viverra suspendisse potenti nullam ac. Pulvinar sapien et ligula ullamcorper. Rhoncus mattis rhoncus urna neque viverra justo nec. Mauris sit amet massa vitae tortor condimentum. Et egestas quis ipsum suspendisse ultrices gravida. Pulvinar etiam non quam lacus suspendisse faucibus interdum. Placerat duis ultricies lacus sed turpis tincidunt. Tempus imperdiet nulla malesuada pellentesque elit eget. In iaculis nunc sed augue lacus viverra vitae congue eu.";

const partners: [string, string, string][] = [
  ["/partners/npo1.jpg", "NPO 1", loremIpsum],
  ["/partners/npo2.jpg", "NPO 2", loremIpsum],
  ["/partners/npo3.jpg", "NPO 3", loremIpsum],
];

function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [0, 1], [-distance, distance]);
}

const PartnerCard = ({ id }: { id: [string, string, string] }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y = useParallax(scrollYProgress, 300);

  return (
    <section
      className="relative h-screen flex flex-col md:flex-row justify-center items-center"
      style={{ scrollSnapType: "y mandatory", scrollSnapAlign: "center" }}
    >
      <div className="relative w-[375px] h-[500px] m-5 overflow-hidden" ref={ref}>
        <Image className="w-full h-full object-cover" src={id[0]} alt="NPO" width={768} height={1024} />
      </div>
      <motion.div
        className="w-[90%] md:w-[400px] mx-5 space-y-3 p-5 rounded-xl bg-white bg-opacity-60 md:bg-transparent"
        style={{ y }}
      >
        <h2 className="font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600">
          {id[1]}
        </h2>
        <h3 className="text-cyan-800">{id[2]}</h3>
      </motion.div>
    </section>
  );
};

const Partners = () => {
  const divRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: divRef,
  });
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={divRef} className="w-full">
      {partners.map((partnerData, i) => {
        return <PartnerCard key={i} id={partnerData} />;
      })}
      <motion.div className="fixed left-0 right-0 h-5 bg-accent bottom-20" style={{ scaleX }} />
    </div>
  );
};

export default Partners;
