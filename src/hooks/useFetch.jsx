import { useEffect, useState } from "react";
import axiosInstance from "../config/axiosInstance";
function useFetch(url) {
  const [data, setData] = useState();
  const [isLoading, setIsloading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance({
        method: "GET",
        url: url,
      });
      setTimeout(() => {
        setData(response?.data?.data);
        setIsloading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  return [data, isLoading, error];
}

export default useFetch;
