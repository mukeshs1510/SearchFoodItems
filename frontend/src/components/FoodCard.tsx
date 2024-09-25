import { FoodData } from "../types/foodDataType";

const FoodCard = ({ foodData }: { foodData: FoodData }) => {
    return (
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {foodData.name}
                </h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <strong>Ingredients:</strong> {foodData.ingredients}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <strong>Diet:</strong> {foodData.diet}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <strong>Preparation Time:</strong> {foodData.prep_time} minutes
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <strong>Cooking Time:</strong> {foodData.cook_time} minutes
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <strong>Flavor Profile:</strong> {foodData.flavor_profile}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <strong>Course:</strong> {foodData.course}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <strong>State:</strong> {foodData.state}
            </p>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                <strong>Region:</strong> {foodData.region}
            </p>
        </div>
    );
};

export default FoodCard;
