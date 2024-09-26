import { useState } from "react";
import FoodCard from "../components/FoodCard";
import LoadingSpinner from "../components/Loading";
import useApiFetch from "../hooks/useApiFetch";
import { FoodsData } from "../types/foodDataType";
import { ArrowLeft, ArrowRight, FilterIcon } from "lucide-react";

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
    const [sortOption, setSortOption] = useState({
        criterion: "prep_time",
        order: "asc",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(12);
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

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.target;
        setSortOption((prev) => ({ ...prev, [name]: value }));
    };

    const sortedData = data?.slice().sort((a, b) => {
        const criterion = sortOption.criterion as "prep_time" | "cook_time";
        const order = sortOption.order === "asc" ? 1 : -1;

        const aValue = a[criterion];
        const bValue = b[criterion];

        return order * (+aValue - +bValue);
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil((sortedData?.length || 0) / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
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

            {/* Sorting Controls */}
            <div className="flex justify-end gap-4 my-4 me-2">
                <select
                    name="criterion"
                    value={sortOption.criterion}
                    onChange={handleSortChange}
                    className="border rounded-lg p-2"
                >
                    <option value="prep_time">Prep Time</option>
                    <option value="cook_time">Cook Time</option>
                </select>
                <select
                    name="order"
                    value={sortOption.order}
                    onChange={handleSortChange}
                    className="border rounded-lg p-2"
                >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>

            {currentItems && currentItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 m-2">
                    {currentItems.map((item, index) => (
                        <FoodCard key={index} foodData={item} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-4xl my-2">No Data Found!</p>
            )}

            {/* Pagination Controls */}
            {sortedData && sortedData.length > itemsPerPage && (
                <div className="flex justify-end gap-4 mt-8 mb-4 me-2">
                    <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg ${
                            currentPage === 1
                                ? "bg-gray-300"
                                : "bg-blue-700 text-white"
                        }`}
                    >
                        <ArrowLeft />
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg ${
                            currentPage === totalPages
                                ? "bg-gray-300"
                                : "bg-blue-700 text-white"
                        }`}
                    >
                        <ArrowRight />
                    </button>
                </div>
            )}
            {error && <p>Error: {error.message}</p>}
        </>
    );
};

export default Home;
