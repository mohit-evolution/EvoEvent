import React, { useState } from "react";
import './Event.css'
import { EditIcon, DeleteIcon } from '../share/image'

const ListViewIn = ({ filteredEvents,handleEdit,handleDeleteModel }) => {
    const [tableData, setTableData] = useState(filteredEvents)
    console.log(tableData, "elfjlsflslfl table")

    return (
        <>
            <div className="container">
                <div className="event-card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Event Name</th>
                                <th scope="col">Date</th>
                                <th scope="col">Event Type</th>
                            </tr>
                        </thead>
                        <tbody>

                            {
                                tableData.map((apidata) => (
                                    <tr key={apidata._id} value={apidata._id}>
                                      
                                        <td>{
                                           
                                                <img src={`http://localhost:5000/${apidata.image}`}
                                                    alt={apidata.eventName}
                                                    className="img-fluid mb-2"
                                                    style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                                                />
                                           
                                            }</td>
                                        <td>{new Date(apidata.eventDate).toLocaleDateString()}</td>
                                        <td>{apidata.category.name}</td>
                                        <td><img src={EditIcon} /></td>
                                        <td><img src={DeleteIcon} 
                                        // onClick={handleEdit()}
                                        /></td>
                                    </tr>
                                ))
                            }

                        </tbody>
                    </table>

                </div>
            </div>
        </>
    )
}
export default ListViewIn