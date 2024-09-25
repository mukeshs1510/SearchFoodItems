import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: AxiosError | null;
}

const useApiFetch = <T>(url: string): UseFetchResult<T> => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<AxiosError | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null); 
            try {
                const response = await axios.get<T>(url);
                setData(response.data);
            } catch (err) {
                if (axios.isAxiosError(err)) {
                    setError(err); 
                } else {
                    const customError: AxiosError = {
                        name: 'CustomError',
                        message: 'An unexpected error occurred',
                        config: {} as any,
                        code: undefined,
                        request: {} as any, 
                        response: undefined,
                        isAxiosError: true,
                        toJSON: () => ({}),
                    };
                    setError(customError);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
};

export default useApiFetch;
