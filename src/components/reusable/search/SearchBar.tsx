import React, { useState } from "react";
import "./search.scss";
import useMediaQuery from "../../../utils/useMediaQuery";
interface SearchProps {
  onSearch: (query: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchProps> = ({ onSearch, placeholder }) => {
  const [query, setQuery] = useState("");
  const isTablet = useMediaQuery("tablet");
  const isMobile = useMediaQuery("mobile");
  const isMobileSm = useMediaQuery("mobilesm");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (newQuery.length >= 2) {
      onSearch(newQuery);
    }
    if (newQuery === "") {
      handleClearSearch();
    }
  };

  const handleClearSearch = () => {
    setQuery("");
    onSearch("");
  };
  function shortenText(text: string, maxLength: number = 7): string {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  }

  const placeholderText =
    !isTablet || (isMobile && !isMobileSm)
      ? placeholder
      : shortenText(placeholder, 10);
  return (
    <div className="searchContainer">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholderText}
      />
      <img src="/images/icon-search.svg" alt="search" />
    </div>
  );
};

export default SearchBar;
