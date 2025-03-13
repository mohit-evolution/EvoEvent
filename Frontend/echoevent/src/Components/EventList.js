import './Event.css';
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { EditIcon, DeleteIcon, ListView, SortView, EchoEvent, Vector, Search, DeleteImage,Plus, CardView, Previousbutton, pagination, Eventviewimage } from '../share/image';
import axios from 'axios'
import SearchIn from './Search';
import ListGroup from './Listgroup';
import Pagination from './pagination';
import ListViewIn from './ListViewIn';
import api from '../axiosInstane';
import * as Yup from 'yup';

const EventList = () => {
    const [imageFile, setImageFile] = useState(null);
    const [eventdata, setEventdata] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editEvent, setEditEvent] = useState(null);
    const [deleteModal, setDeleteModel] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [categories, setCategory] = useState([])
    const fileInputRef = useRef(null);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const [searchQuery, setSearchQuery] = useState("");
    const [listview, setListView] = useState(false)
    const [showFilterOptions, setShowFilterOptions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortOption, setSortOption] = useState("");
    const itemsPerPage = 3;
    const token = localStorage.getItem("echotoken")
    console.log(token, "tokenjfjlfjljfjl of getevent")

    const fetchCategory = async () => {
        const catresp = await api.get(`/api/category/getcategory`)
        setCategory(catresp.data)
    }

    const handleClick = () => {
        fileInputRef.current.value = "";
        fileInputRef.current.click();
    };

    const handleListView = () => {
        setListView(true)
    }

    const handleListViewClose = () => {
        setListView(false)
    }

    const fetchData = async () => {
        try {
            const response = await api.get(`/api/events/getEvent`);
            setEventdata(response.data);
            setFilteredEvents(response.data)
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setCurrentPage(1); 

        if (query === "") {
            setFilteredEvents(eventdata); 
        } else {
            const filtered = eventdata.filter(event =>
                event.eventName.toLowerCase().includes(query) ||
                event?.category?.name.toLowerCase().includes(query)
            );
            setFilteredEvents(filtered);
        }
    };

    const toggleFilterMenu = () => {
        setShowFilterOptions(!showFilterOptions);
    };



    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".filter-container")) {
                setShowFilterOptions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleFilterChange = (category) => {
        setSelectedCategory(category);
        if (category.value === "all") {
            setFilteredEvents(eventdata);
        } else {
            const filtered = eventdata.filter(event => event.category.name === category.value);
            setFilteredEvents(filtered);
        }
        setCurrentPage(1); 
        setShowFilterOptions(false);
    };

    const filterOptions = [
        { label: "All Events", value: "all" },
        ...Array.from(new Set(eventdata.map(event => event.category.name))) 
            .map(category => ({ label: category, value: category }))
    ];

    // 🔹 Pagination Logic
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };



    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (!file) return;
        setImageFile(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
    };

    useEffect(() => {
        console.log("Updated previewImage:", previewImage);
    }, [previewImage]);

    const handleOpenModal = () => {
        setEditEvent(null);
        setImageFile(null);
        setPreviewImage(null)
        setShowModal(true);
    };

    const handleEdit = (event) => {
        setEditEvent(event);
        setShowModal(true);
    };

    const handleDeleteModel = (eventId) => {
        setDeleteModel(true)
        setSelectedEventId(eventId)
    }

    const handleDelete = async (eventId) => {
        try {
            await api.delete(`/api/events/deleteEvent/${eventId}`);
            setEventdata(prevData => prevData.filter(event => event._id !== eventId));
        } catch (error) {
            console.error("Error deleting event:", error);
        }
        setDeleteModel(false)
        fetchData()
    };

    useEffect(() => {
        fetchData();
        fetchCategory()
    }, []);

    const formik = useFormik({
        initialValues: {
            eventName: editEvent ? editEvent.eventName : '',
            eventDate: editEvent ? editEvent.eventDate : '',
            category: editEvent ? editEvent.category : '',
            imageFile: editEvent ? editEvent.imageFile : ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            eventName: Yup.string().required('Event Name is required'),
            eventDate: Yup.date().required('Event Date is required'),
            category: Yup.string().required('Event Category is required'),
        }),
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("eventName", values.eventName);
            formData.append("eventDate", values.eventDate);
            formData.append("category", values.category);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            try {
                if (editEvent) {

                    await api.put(`/api/events/editEvent/${editEvent._id}`, formData);
                } else {

                    await api.post("/api/events/addEvent", formData);
                }

                formik.resetForm();
                setShowModal(false);
                fetchData();
            } catch (error) {
                console.error("Error:", error);
            }
        },
    });


    useEffect(() => {
        if (editEvent) {
            console.log("Raw eventDate from DB:", editEvent.eventDate);

            formik.setValues({
                eventName: editEvent.eventName || '',
                eventDate: editEvent.eventDate
                    ? new Date(editEvent.eventDate).toISOString().split('T')[0]
                    : '',
                category: editEvent.category._id || '',
                imageFile: editEvent.imageFile || ''
            });

            if (editEvent.image) {
                setPreviewImage(`http://localhost:5000/${editEvent.image}`);
            }

        }
    }, [editEvent]);


    console.log(editEvent, "edit Event of data")


    return (
        <>
            <div className="container">
                <div className='d-card mt-3 mb-3'>
                    <div className='row'>
                        <div className='col col-md-6 col-sm-6 col-lg-8 mt-2'>
                            <img src={EchoEvent}
                                className='img-fluid' />
                        </div>
                        <div className='col col-md-6 col-sm-6 col-lg-4 mt-2'>
                            <SearchIn
                                searchQuery={searchQuery}
                                handleSearchChange={handleSearchChange}
                            />
                        </div>
                    </div>

                </div>
                <div className='row'>
                    <div className='col-12 col-sm-6 col-lg-6 col-md-6'>
                        <h3>Events</h3>
                        <p>View and Manage Every Event of Future</p>
                    </div>
                    <div className='col-12 col-sm-6 col-lg-6 col-md-6 d-flex justify-content-around'>
                        <div className="filter-container" style={{ position: "relative" }}>
                            <button className='filter-btn filter-event-btn' onClick={toggleFilterMenu}>
                                 <img src={SortView} />
                               <span className='filter-text-ev'> Filter </span>
                            </button>

                            {/* 🔽 Filter Options ListGroup Component */}
                            {showFilterOptions && (
                                <ListGroup items={filterOptions} onSelectItem={handleFilterChange} />
                            )}
                        </div>
                      
                            <div>
                                {
                                    listview ? (
                                        <>
                                            <button onClick={handleListViewClose} className='card-event-view'>
                                                    <img src={CardView}
                                                    />
                                                   <span className='card-view-text-ev'>Card View</span> 
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                          
                                 <button  onClick={handleListView} className='List-event-view'>
                                 <img src={ListView} />
                                 <span className='list-view-text-ev'>List View</span>
                            </button>
                                        </>
                                    )

                                }
                            </div>
                     <div>
                        <button onClick={handleOpenModal} className='add-newevent-btn'>
                           <img src={Plus} className='plus-icon'/>
                            Add New Event
                        </button>
                        </div>
                    </div>
                </div>
                {

                    listview ? (
                        <>
                            <ListViewIn
                                filteredEvents={currentEvents}
                                handleEdit={handleEdit}
                                handleDeleteModeld={handleDeleteModel}
                            />

                        </>
                    ) :
                        (
                            <>
                                <div className="row mt-3">
                                    {currentEvents.length > 0 ? (
                                        currentEvents?.map((event) => (
                                            <div key={event._id} className="col-md-4 col-sm-4 col-lg-4 mb-3">
                                                <div className="event-card">
                                                    {event.image && (
                                                        <img src={`http://localhost:5000/${event.image}`}
                                                            alt={event.eventName}
                                                            className="img-fluid mb-2"
                                                            style={{ width: "100%", maxHeight: "200px", objectFit: "cover" }}
                                                        />
                                                    )}
                                                    <div className='event-card-text'>
                                                        <h5>{event.eventName}</h5>

                                                        <div>
                                                            <img src={EditIcon} alt="Edit" style={{ width: "20px", marginRight: "5px", cursor: "pointer" }}
                                                                onClick={() => handleDeleteModel(event._id)}
                                                            />
                                                            <img src={DeleteIcon} alt="Delete" style={{ width: "20px", marginRight: "5px", cursor: "pointer" }}
                                                                onClick={() => handleEdit(event)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className='even-date-category'>
                                                        <div className='category-font-b'>
                                                            <p className='category-font'>{event?.category?.name}</p>
                                                        </div>
                                                        <p className='category-data'> {new Date(event.eventDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    ) : (
                                        <>
                                            <img src={Eventviewimage}
                                                className='event-no-data'
                                            />
                                            <p className="text-center">No Event’s to show yet</p>
                                            <p className="text-center"> add new event here...</p>
                                        </>

                                    )}
                                </div>

                            </>
                        )
                }
                {filteredEvents.length > itemsPerPage && (
                    <Pagination
                        totalItems={filteredEvents.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>


            {/* Modal */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="eventModalLabel">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editEvent ? "Edit Event" : "New Event"}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={formik.handleSubmit}>

                                    <div className='drag-model-input-img'>
                                        {previewImage ? (
                                            <div className="mb-3" onClick={handleClick} style={{ cursor: "pointer" }}>
                                                <img src={previewImage} alt="Preview" className="img-preview" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    name="image"
                                                    onChange={handleImageChange}
                                                    ref={fileInputRef}
                                                    style={{ display: "none" }} // Hide input
                                                />
                                            </div>
                                        ) : (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                name="image"
                                                onChange={handleImageChange}
                                                ref={fileInputRef}
                                            />
                                        )}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Event Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter event name"
                                            name="eventName"
                                            value={formik.values.eventName}
                                            onChange={formik.handleChange}
                                        />
                                        {formik.touched.eventName && formik.errors.eventName ? (
                                            <div className='text-danger'>{formik.errors.eventName}</div>
                                        ) : null}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Event Date</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="eventDate"
                                            value={formik.values.eventDate || ''}
                                            onChange={formik.handleChange}
                                        />
                                        {formik.touched.eventDate && formik.errors.eventDate ? (
                                            <div className='text-danger'>{formik.errors.eventDate}</div>
                                        ) : null}
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Event Category</label>
                                        <select
                                            className="form-control"
                                            name="category"
                                            onChange={formik.handleChange}
                                            value={formik.values.category}
                                        >
                                            <option value="" disabled>Select Option</option>
                                            {categories?.map((category) => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.category && formik.errors.category ? (
                                            <div className='text-danger'>{formik.errors.category}</div>
                                        ) : null}
                                    </div>

                                    <div className="modal-footer">
                                        <button type="button" className="model-close-button" onClick={() => setShowModal(false)}>
                                            Cancel
                                        </button>
                                        <button type="submit" className="model-delete-button">
                                            {editEvent ? "Update" : "Save"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" aria-labelledby="eventModalLabel">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Delete ?</h5>
                                <button type="button" className="btn-close" onClick={() => setDeleteModel(false)}></button>
                            </div>
                            <div className="modal-body">
                                <h6>Are you sure want to delete this event ?</h6>
                                <img src={DeleteImage}
                                    className='delete-image-icon'
                                />

                                <div className="modal-footer model-align-button">
                                    <button type="button" className="model-close-button" onClick={() => setDeleteModel(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="model-delete-button"
                                        onClick={() => handleDelete(selectedEventId)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default EventList;
