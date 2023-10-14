import React from "react";

interface ButtonMarqueeProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  text: string;
}

export default function ButtonMarquee({ isLoading = undefined, text, ...props }: ButtonMarqueeProps) {
  return (
    <button
      className={`mt-10 btn btn-lg w-[200px] btn-primary overflow-hidden group`}
      //   disabled={isLoading}
      //   onClick={() => onDonate()}
      {...props}
    >
      {isLoading != undefined && <span className={isLoading ? "loading loading-spinner" : ""}></span>}
      <span className=" text-black font-bold group-hover:hidden ">{text}</span>
      <span className="hidden marquee-text text-black font-bold group-hover:block group-hover:animate-marquee">
        {text}
      </span>
    </button>
  );
}
