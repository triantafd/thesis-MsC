import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Button from "./";
import "@testing-library/jest-dom";
import { FaArrowLeft } from "react-icons/fa";

describe("Button Component", () => {
  test("renders correctly", () => {
    render(
      <Button variant="filled" color="blue">
        Click me
      </Button>
    );
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  test("applies correct styles for variant and color", () => {
    render(
      <Button variant="filled" color="blue">
        Style Test
      </Button>
    );
    expect(screen.getByRole("button")).toHaveClass("bg-blue-500");
  });

  test("applies disabled styles when disabled", () => {
    render(
      <Button disabled variant="outlined" color="red">
        Disabled
      </Button>
    );
    expect(screen.getByRole("button")).toHaveClass(
      "opacity-50 cursor-not-allowed"
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  test("renders loader when loading", () => {
    render(
      <Button loading variant="outlined" color="green">
        Button Text
      </Button>
    );
    expect(screen.getByTestId("button-loader")).toBeInTheDocument();
  });

  test("renders icon when icon prop is passed", () => {
    const icon = <span>Icon</span>;
    render(
      <Button icon={icon} variant="outlined" color="green">
        With imageIcon
      </Button>
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  test("renders icon when react-icon prop is passed", () => {
    const icon = <span data-testid="icon"><FaArrowLeft /></span>;
    render(
      <Button icon={icon} variant="outlined" color="green">
        With Icon
      </Button>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  test("handles click events", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} variant={"filled"} color={"blue"}>
        Click Me
      </Button>
    );
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
