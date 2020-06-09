import React from "react";

import classes from "./Search.module.css";

const SearchBox = (props) => {
    return (
            <input
                className={classes.Search}
                type="text"
                placeholder="Search"
                value={props.value}
                onChange={props.onChangeHandler}
            />
    );
};

export default SearchBox;
