import { useDebounce } from "./useDebounce";

import { useEffect, useMemo, useState } from "react";

/**
 * @typedef {Object} SearchResult
 * @property {function} setRecords function to set the records to be filtered
 * @property {function} setQueryValue function to set the search query
 * @property {boolean} isSearchLoading boolean to indicate if the search is loading
 * @property {array} filteredData filtered records based on the search query and columns if it is not empty otherwise it will be the passed records
 
 * @function useTableSearch
 * @param {*} records are the original copy of the data which is to be filtered
 * @param {*} columns are the columns name which are to be filtered
 * @returns {SearchResult}
 */
export function useTableSearch(columns = []) {
  const [records, setRecords] = useState([]);
  const { setQueryValue, debouncedValue, queryValue } = useDebounce();

  const [filteredData, setFilteredData] = useState([]);
  const [isSearchLoading, setIsSearchLoading] = useState();

  useEffect(() => {
    setIsSearchLoading(true);

    const filtered = records.filter((item) =>
      columns.some((column) =>
        String(item[column])
          .toLowerCase()
          .includes(String(queryValue).toLowerCase()),
      ),
    );

    setFilteredData(filtered);
    setIsSearchLoading(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, records]);

  useEffect(() => {
    if (queryValue) setIsSearchLoading(true);

    return () => {
      setIsSearchLoading(false);
    };
  }, [queryValue]);

  const returnValue = useMemo(
    () => ({
      setRecords,
      setQueryValue,
      isSearchLoading,
      filteredData: queryValue ? filteredData : records,
    }),
    [filteredData, isSearchLoading, queryValue, records, setQueryValue],
  );

  return returnValue;
}
