import { GiMirrorMirror } from "react-icons/gi";
import { FaRug } from "react-icons/fa6";
import { FaQuestion } from "react-icons/fa";

const getIconName = (category: string) => {
  switch (category) {
    case "carpet":
      return FaRug;
    case "mirror":
      return GiMirrorMirror;
    default:
      return FaQuestion;
  }
};

const calculateTotals = (categoryData: any, category: string) => {
  const goodCount = categoryData?.[`good_${category}`] || 0;
  const badCount = categoryData?.[`bad_${category}`] || 0;
  const totalCount = goodCount + badCount;

  return { goodCount, badCount, totalCount };
};

export { getIconName, calculateTotals };
