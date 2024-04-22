import "./ButtonLoader.css";

type Size = "small" | "medium" | "large";

interface LoadingIndicatorProps {
  size?: Size;
  color?: string;
}

const ButtonLoader: React.FC<LoadingIndicatorProps> = ({
  size = "medium",
  color,
}) => {
  const sizeMap: Record<Size, string> = {
    small: "1rem",
    medium: "1.5rem",
    large: "2rem",
  };

  const loaderStyle = {
    color,
    width: sizeMap[size],
    height: sizeMap[size],
  };

  // Construct the class name based on the color prop
  const loaderClassName = `loader ${color}`;

  return (
    <div
      data-testid="button-loader"
      className={loaderClassName}
      style={loaderStyle}
    ></div>
  );
};
export default ButtonLoader;
