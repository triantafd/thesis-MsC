import { calculateTotals, getIconName } from "./utils";

interface CardAnalyticsProps {
  analytics: any;
}

const CardAnalytics: React.FC<CardAnalyticsProps> = ({ analytics }) => {
  return (
    <div>
      {analytics &&
        Object.keys(analytics).map((category: any) => {
          const IconComponent = getIconName(category);
          const { goodCount, badCount, totalCount } = calculateTotals(
            analytics[category],
            category
          );
          const isGoodMajority = goodCount / totalCount > 0.5;
          return (
            <div key={category} className="lg:w-1/2 xl:w-1/4 mb-4">
              <div className="bg-slate-300 p-4 shadow-md rounded-lg">
                <div>
                  <h2 className="uppercase underline text-gray-700 text-lg mb-2">
                    {category}
                  </h2>
                  <span className="text-lg font-bold">
                    Total Images: {totalCount}
                  </span>
                </div>
                <div className="flex justify-row justify-between mt-4 mb-4">
                  {/* Subcategories */}
                  <div>
                    {/* Good Subcategory */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg text-green-500 mr-2">Good</span>
                      <span className="text-lg font-bold">
                        {goodCount}
                      </span>{" "}
                      {/* Replace 40 with 'good' count */}
                    </div>
                    <div className="h-2 bg-green-200 rounded-full mb-4">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: "40%" }}
                      ></div>{" "}
                      {/* Width based on 'good' percentage */}
                    </div>

                    {/* Bad Subcategory */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg text-red-500 ">Bad</span>
                      <span className="text-lg font-bold">{badCount}</span>{" "}
                      {/* Replace 60 with 'bad' count */}
                    </div>
                    <div className="h-2 bg-red-200 rounded-full">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: "60%" }}
                      ></div>{" "}
                      {/* Width based on 'bad' percentage */}
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <div className="icon flex items-center justify-center h-10 w-10 bg-blue-500 text-white rounded-full shadow">
                      <IconComponent className="text-3xl" />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-gray-500 text-xs">
                  <span
                    className={`text-lg ${
                      isGoodMajority ? "text-green-500" : "text-red-500"
                    } mr-2`}
                  >
                    <IconComponent className="inline text-2xl" />{" "}
                    {Math.round((goodCount / totalCount) * 100)}%
                  </span>{" "}
                  <span className="whitespace-nowrap">Dementia friendly</span>
                </p>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default CardAnalytics;
