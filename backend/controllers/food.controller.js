import { csvToJson } from "../csvToJson.js";

class DataController {
    static async getData(req, res) {
        const { prep_time, cook_time } = req.query;
        const data = await csvToJson();
        let filteredData = data;

        filteredData = applyFilters(filteredData, { prep_time, cook_time });

        res.status(200).json(filteredData);
    }

    static async getDataBySearch(req, res) {
        const { s, prep_time, cook_time } = req.query;
        const data = await csvToJson();
        let filteredData = data;

        if (s) {
            const nameMatches = data.filter((item) =>
                item["name"]
                    .toString()
                    .toLowerCase()
                    .includes(s.toString().toLowerCase())
            );

            const stateMatches = data.filter((item) =>
                item["state"]
                    .toString()
                    .toLowerCase()
                    .includes(s.toString().toLowerCase())
            );

            const ingredientMatches = data.filter((item) => {
                const ingredientsArray = item["ingredients"]
                    .toString()
                    .toLowerCase()
                    .split(",")
                    .map((ing) => ing.trim());
                const searchTerms = s
                    .toString()
                    .toLowerCase()
                    .split(",")
                    .map((term) => term.trim());
                return searchTerms.every((term) =>
                    ingredientsArray.some((ingredient) =>
                        ingredient.includes(term)
                    )
                );
            });

            filteredData = [
                ...new Set([
                    ...nameMatches,
                    ...stateMatches,
                    ...ingredientMatches,
                ]),
            ];
        }

        filteredData = applyFilters(filteredData, { prep_time, cook_time });

        res.status(200).json(filteredData);
    }
}

const applyFilters = (data, filters) => {
    const { prep_time, cook_time } = filters;

    if (prep_time) {
        data = applyFilter(data, "prep_time", prep_time);
    }

    if (cook_time) {
        data = applyFilter(data, "cook_time", cook_time);
    }

    return data;
};

const applyFilter = (data, field, filters) => {
    if (filters.eq) {
        data = data.filter((item) => item[field] == parseFloat(filters.eq));
    }
    if (filters.gt) {
        data = data.filter((item) => item[field] > parseFloat(filters.gt));
    }
    if (filters.gte) {
        data = data.filter((item) => item[field] >= parseFloat(filters.gte));
    }
    if (filters.lt) {
        data = data.filter((item) => item[field] < parseFloat(filters.lt));
    }
    if (filters.lte) {
        data = data.filter((item) => item[field] <= parseFloat(filters.lte));
    }
    return data;
};

export default DataController;
