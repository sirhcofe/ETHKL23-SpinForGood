// const Home = () => {
//   return (
//     <div className="hero">
//       <div className="hero-content"></div>
//     </div>
//   );
// };
// export default Home;
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { color, useScroll, useTime, useTransform } from "framer-motion";
import { degreesToRadians, mix, progress } from "popmotion";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";

const colors = [0x00babb, 0x00fcff, 0x006e6f, 0x00dfe2];

// const Icosahedron = () => (
//   <mesh rotation-x={0.35}>
//     <icosahedronGeometry args={[1, 0]} />
//     <meshBasicMaterial wireframe color={color} />
//   </mesh>
// );

// const Ethereum = () => {
//   const ethereumRef = useRef<THREE.Object3D>(null);

//   useLayoutEffect(() => {
//     const loader = new STLLoader();
//     loader.load("assets/eth.STL", geometry => {
//       const material = new THREE.MeshPhongMaterial({
//         color: 0xffffff,
//       });
//         const mesh = new THREE.Mesh(geometry, material);
//       //   if (ethereumRef.current) {
//       //     ethereumRef.current.add(mesh);
//       //   }
//       ethereumRef.current!.position.setFromSphericalCoords(3, 0, 0);
//     });
//   });

//   //   return <group ref={ethereumRef}></group>;
//   //   position={[0.05, 0.05, 1000]}
//   return (
//     <mesh ref={ethereumRef}>
//       <boxGeometry args={[0.05, 0.05, 0.05]} />
//       {/* <meshBasicMaterial wireframe color={color} /> */}
//     </mesh>
//   );
// };

const Star = ({ p }: { p: number }) => {
  const ref = useRef<THREE.Object3D>(null);

  useLayoutEffect(() => {
    const distance = mix(2, 3.5, Math.random());
    const yAngle = mix(degreesToRadians(80), degreesToRadians(100), Math.random());
    const xAngle = degreesToRadians(360) * p;
    ref.current!.position.setFromSphericalCoords(distance, yAngle, xAngle);
  });

  function getRandomColors() {
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }

  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
      <meshBasicMaterial wireframe color={getRandomColors()} />
    </mesh>
  );
};

function Scene({ numStars = 100 }) {
  const gl = useThree(state => state.gl);
  const { scrollYProgress } = useScroll();
  const yAngle = useTransform(scrollYProgress, [0, 1], [0.001, degreesToRadians(180)]);
  const distance = useTransform(scrollYProgress, [0, 1], [10, 3]);
  const time = useTime();

  useFrame(({ camera }) => {
    camera.position.setFromSphericalCoords(distance.get(), yAngle.get(), time.get() * 0.0005);
    camera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  });

  useLayoutEffect(() => gl.setPixelRatio(0.3));

  const stars = [];
  for (let i = 0; i < numStars; i++) {
    stars.push(<Star p={progress(0, numStars, i)} />);
  }

  return (
    <>
      {/* <Ethereum /> */}
      {stars}
    </>
  );
}

export default function Home() {
  return (
    <div className="h-[300vh]">
      <div className="fixed w-full top-0 left-0 right-0 bottom-0">
        <Canvas gl={{ antialias: false }}>
          <Scene />
        </Canvas>
      </div>
      <div className="flex flex-col w-full h-[100vh] items-center justify-center ">
        <h1 className="text-9xl font-extrabold -mt-20 z-10">hello.</h1>
      </div>
      <div className="flex flex-col w-full h-[100vh] items-start justify-center">
        <h1 className="text-9xl font-extrabold ml-32 -mt-20 z-10 text-[#009395]">Your</h1>
        <h1 className="pb-5 text-9xl font-extrabold ml-32 z-10 text-transparent bg-clip-text bg-gradient-to-br from-[#0000FF] to-[#009395]">
          good deeds
        </h1>
      </div>
      <div className="flex flex-col w-full h-[100vh] items-end justify-center">
        <h1 className="text-9xl font-extrabold mr-40 z-10 text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-[#FF8C00]">
          Awaits.
        </h1>
      </div>
    </div>
  );
}

{
  /* <Canvas gl={{ antialias: false }} style={{ imageRendering: "pixelated" }}> */
}
