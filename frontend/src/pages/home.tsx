import { useState } from "react";
import FoodCard from "../components/FoodCard";
import LoadingSpinner from "../components/Loading";
import useApiFetch from "../hooks/useApiFetch";
import { FoodsData } from "../types/foodDataType";
import { FilterIcon } from "lucide-react";

const Home = () => {
    const [apiEndPoint, setApiEndPoint] = useState("/food/items");
    const [searchTerm, setSearchTerm] = useState("");
    const [prepTimeFilter, setPrepTimeFilter] = useState({
        operator: "gte",
        value: "",
    });
    const [cookTimeFilter, setCookTimeFilter] = useState({
        operator: "gte",
        value: "",
    });
    const [showSearchFilter, setShowSearchFilter] = useState(false);
    const { data, loading, error } = useApiFetch<FoodsData>(apiEndPoint);

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (searchTerm) {
            setApiEndPoint(`/food/search?s=${searchTerm}`);
        } else {
            setApiEndPoint("/food/items");
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value === "") {
            setApiEndPoint("/food/items");
        }
    };

    const handleFilterChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        filterType: "prep" | "cook"
    ) => {
        const { name, value } = event.target;
        if (filterType === "prep") {
            setPrepTimeFilter((prev) => ({ ...prev, [name]: value }));
        } else {
            setCookTimeFilter((prev) => ({ ...prev, [name]: value }));
        }
    };

    const applyFilters = () => {
        const { operator: prepOperator, value: prepValue } = prepTimeFilter;
        const { operator: cookOperator, value: cookValue } = cookTimeFilter;

        let filterParams = [];
        if (prepValue) {
            filterParams.push(`prep_time[${prepOperator}]=${prepValue}`);
        }
        if (cookValue) {
            filterParams.push(`cook_time[${cookOperator}]=${cookValue}`);
        }

        if (filterParams.length > 0) {
            setApiEndPoint(`/food/items?${filterParams.join("&")}`);
        }
    };

    const toggleSearchFilter = () => {
        setShowSearchFilter((prev) => !prev);
    };

    return (
        <>
            {loading && <LoadingSpinner />}
            <h4 className="text-center text-4xl my-2">Famous Food Items</h4>
            <div className="max-w-md mx-auto py-8 flex gap-2">
                <form onSubmit={handleSearch} className="flex w-96 gap-2">
                    <input
                        type="search"
                        className="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg"
                        placeholder="Search food items, ingredients..."
                        value={searchTerm}
                        onChange={handleInputChange}
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Search
                    </button>
                </form>
                <button
                    onClick={toggleSearchFilter}
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg inline-flex items-center"
                >
                    <FilterIcon />
                    <span>Filter</span>
                </button>
            </div>

            {showSearchFilter && (
                <div className="w-1/2 mx-auto mb-4 p-4 border rounded-lg bg-gray-100">
                    <h5 className="text-lg font-semibold">Filters</h5>
                    <div className="mb-4">
                        <label className="block text-sm">Prep Time</label>
                        <div className="flex gap-2">
                            <select
                                name="operator"
                                value={prepTimeFilter.operator}
                                onChange={(e) => handleFilterChange(e, "prep")}
                                className="border rounded-lg p-2 w-1/2"
                            >
                                <option value="gte">
                                    Greater than or equal to
                                </option>
                                <option value="gt">Greater than</option>
                                <option value="lt">Less than</option>
                                <option value="lte">
                                    Less than or equal to
                                </option>
                            </select>
                            <input
                                type="number"
                                name="value"
                                value={prepTimeFilter.value}
                                onChange={(e) => handleFilterChange(e, "prep")}
                                className="border rounded-lg p-2 w-1/2"
                                placeholder="Time"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm">Cook Time</label>
                        <div className="flex gap-2">
                            <select
                                name="operator"
                                value={cookTimeFilter.operator}
                                onChange={(e) => handleFilterChange(e, "cook")}
                                className="border rounded-lg p-2 w-1/2"
                            >
                                <option value="gte">
                                    Greater than or equal to
                                </option>
                                <option value="gt">Greater than</option>
                                <option value="lt">Less than</option>
                                <option value="lte">
                                    Less than or equal to
                                </option>
                            </select>
                            <input
                                type="number"
                                name="value"
                                value={cookTimeFilter.value}
                                onChange={(e) => handleFilterChange(e, "cook")}
                                className="border rounded-lg p-2 w-1/2"
                                placeholder="Time"
                            />
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="mt-4 bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Apply Filters
                    </button>
                </div>
            )}

            {data && data.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 m-2">
                    {data.map((item, index) => (
                        <FoodCard key={index} foodData={item} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-4xl my-2">No Data Found!</p>
            )}
            {error && <p>Error: {error.message}</p>}
        </>
    );
};

export default Home;
