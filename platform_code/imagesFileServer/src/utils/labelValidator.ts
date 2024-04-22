// Define a type for valid labels
type ValidLabel = "building" | "house";

// Function to validate the label
export const isValidLabel = (label: string): label is ValidLabel => {
  return label === "building" || label === "house";
};
