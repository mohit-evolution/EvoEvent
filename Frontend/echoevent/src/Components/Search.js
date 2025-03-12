import React from "react";
import { SearchIcon, Vector1 } from "../share/image";
import "./Search.css";

const SearchIn = ({ searchQuery, handleSearchChange }) => {
    return (
        <div className="container-fluid">
            <form className="d-flex search-container ml-2">
                <div className="input-wrapper">
                    <img src={SearchIcon} className="search-icon" alt="Search" />
                    <input
                        className="form-control-search-bar"
                        type="search"
                        placeholder="Search here..."
                        aria-label="Search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <img src={Vector1} className="img-fluid user-img" alt="User" />
            </form>
        </div>
    );
};

export default SearchIn;
