import React from 'react';

const ListGroup = ({ items, onSelectItem }) => {
    console.log(items,"items of data")
    return (
        <ul className="list-group" style={{
            position: "absolute", 
            top: "100%", 
            left: "0", 
            backgroundColor: "white",
            border: "1px solid #ccc",
            padding: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: "10",
            cursor: "pointer"
        }}>
            {items.map((item, index) => (
                <li 
                    key={index} 
                    className="list-group-item" 
                    onClick={() => onSelectItem(item)}
                    style={{ padding: "8px", borderBottom: "1px solid #ddd" }}
                >
                    {item.label}
                </li>
            ))}
        </ul>
    );
};

export default ListGroup;
