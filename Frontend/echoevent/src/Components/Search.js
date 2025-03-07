import React from "react";
import { Search } from "../share/image";

const SearchIn = ({searchQuery,handleSearchChange}) => {
    return (
        <>
            <div className="search-event">
                <img src={Search} className="search-icon" alt="Search Icon" />
                <input type="text" id="search" name="searchQuery" placeholder="Search"
                    className="search-input"
                value={searchQuery}
                onChange={handleSearchChange}
                />
            </div>
        </>
    )
}
export default SearchIn