import React from "react";

const ContentWrapper: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return (
    <div
      className={
        "bg-white px-8 py-10 mb-8 rounded-md dark:text-black" +
        " " +
        props.className
      }>
      {props.children}
    </div>
  );
};

export default ContentWrapper;