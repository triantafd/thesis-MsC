import React from "react";
import ButtonLoader from "../Loaders/ButtonLoader";

type ButtonVariant = "filled" | "outlined";
type ButtonColor = "blue" | "red" | "green";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
  color: ButtonColor;
  loading?: boolean;
  icon?: React.ReactNode;
}

const colorStyles = {
  blue: {
    filled: "bg-blue-500 hover:bg-blue-700 text-white",
    outlined:
      "border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white",
  },
  red: {
    filled: "bg-red-500 hover:bg-red-700 text-white",
    outlined:
      "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white",
  },
  green: {
    filled: "bg-green-500 hover:bg-green-700 text-white",
    outlined:
      "border border-green-500 text-green-500 hover:bg-green-500 hover:text-white",
  },
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  color,
  className,
  loading,
  icon,
  ...props
}) => {
  const baseStyle = `${colorStyles[color][variant]} font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out`;
  const combinedClassName = `${baseStyle} ${className || ""}`.trim();
  const disabledStyle = "opacity-50 cursor-not-allowed";

  const finalStyle = props.disabled
    ? `${combinedClassName} ${disabledStyle}`
    : combinedClassName;

  return (
    <div>
      <button className={finalStyle} {...props}>
        <div className="flex flex-row justify-center items-center">
          {icon && <div className="pr-2">{icon}</div>}
          {children}
          {loading && (
            <div className="flex pl-2">
              <ButtonLoader />
            </div>
          )}
        </div>
      </button>
    </div>
  );
};

export default Button;
