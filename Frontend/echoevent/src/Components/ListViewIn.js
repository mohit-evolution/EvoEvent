import React, { useState } from "react";
import './Event.css';
import './ListViewIn.css';
import { EditIcon, DeleteIcon, DeleteImage } from '../share/image';

const ListViewIn = ({ filteredEvents, handleEdit, handleDeleteModeld}) => {
  console.log(filteredEvents,"fitletered Events of data")
    return (
        <>
            <div className="container">
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Event Name</th>
                            <th scope="col">Date</th>
                            <th scope="col">Event Type</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((apidata) => (
                            <tr key={apidata._id}>
                                <td>
                                    <img 
                                        src={`http://localhost:5000/${apidata.image}`} 
                                        alt={apidata.eventName} 
                                        className="img-fluid mb-2 img-view-list"
                                    />
                                    {apidata.eventName}
                                </td>
                                <td>{new Date(apidata.eventDate).toLocaleDateString()}</td>
                                <td>{apidata.category.name}</td>
                                <td>
                                    <img 
                                        src={EditIcon} 
                                        alt="Edit" 
                                        style={{ cursor: "pointer", marginRight: "10px" }} 
                                        onClick={() => handleDeleteModeld(apidata._id)}
                                    />
                                    <img 
                                        src={DeleteIcon} 
                                        alt="Delete" 
                                        style={{ cursor: "pointer" }} 
                                        onClick={() => handleEdit(apidata)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
    
};

export default ListViewIn;
