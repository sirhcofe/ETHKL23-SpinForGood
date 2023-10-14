import { useRef } from "react";
import Image from "next/image";
import { MotionValue, motion, useScroll, useSpring, useTransform } from "framer-motion";

const loremIpsum =
  "Non-profit organizations (NPOs) are dedicated entities committed to making a positive impact on society without the primary goal of generating profits. They are driven by a mission to serve the common good and often rely on donations, grants, and volunteer efforts to support their activities. Their work ranges from humanitarian aid, healthcare, and environmental conservation to education, arts and culture promotion, and many other vital areas, contributing to the betterment of society and the well-being of its members.";

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
      className="relative h-screen flex flex-col md:flex-row justify-center items-center z-10"
      style={{ scrollSnapType: "y mandatory", scrollSnapAlign: "center" }}
    >
      <div className="relative w-[375px] h-[500px] m-5" ref={ref}>
        <Image className="w-full h-full object-cover" src={id[0]} alt="NPO" width={768} height={1024} />
      </div>
      <motion.div
        className="w-[90%] md:w-[400px] mx-5 space-y-3 p-5 rounded-xl bg-white bg-opacity-90 md:bg-transparent"
        style={{ y }}
      >
        <h2 className="font-extrabold text-4xl text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-red-600">
          {id[1]}
        </h2>
        <h3 className="text-[#bb892d] md:font-semibold text-sm md:text-lg tracking-normal md:tracking-wide leading-tight md:leading-relaxed">
          {id[2]}
        </h3>
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
      <motion.div className="fixed left-0 right-0 h-5 bg-accent bottom-20 z-20" style={{ scaleX }} />
    </div>
  );
};

export default Partners;
