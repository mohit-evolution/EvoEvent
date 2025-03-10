import './Event.css';
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { EditIcon, DeleteIcon, ListView, SortView, EchoEvent, Vector, Search, DeleteImage, CardView, Previousbutton, pagination, Eventviewimage } from '../share/image';
import axios from 'axios'
import SearchIn from './Search';
import ListGroup from './Listgroup';
import Pagination from './pagination';
import ListViewIn from './ListViewIn';
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
        const catresp = await axios.get(`http://localhost:5000/api/category/getcategory`)
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
            const response = await axios.get(`http://localhost:5000/api/events/getEvent`
                , {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setEventdata(response.data);
            setFilteredEvents(response.data)
        } catch (error) {
            console.log(error);
        }
    };

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        setCurrentPage(1); // Reset to first page when searching

        if (query === "") {
            setFilteredEvents(eventdata); // Reset filter when search is cleared
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
        setCurrentPage(1); // Reset to first page after filtering
        setShowFilterOptions(false);
    };

    const filterOptions = [
        { label: "All Events", value: "all" },
        ...Array.from(new Set(eventdata.map(event => event.category.name))) // Extract unique categories
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
            await axios.delete(`http://localhost:5000/api/events/deleteEvent/${eventId}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setEventdata(prevData => prevData.filter(event => event._id !== eventId));
            // alert("Event deleted successfully!");
        } catch (error) {
            console.error("Error deleting event:", error);
            // alert("Failed to delete event. Please try again.");
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

                    await axios.put(`http://localhost:5000/api/events/editEvent/${editEvent._id}`, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            'Authorization': `Bearer ${token}`
                        },
                    });
                } else {

                    await axios.post("http://localhost:5000/api/events/addEvent", formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            'Authorization': `Bearer ${token}`

                        },
                    });
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

                    <div className='d-card-data'>
                        <div className='echo-event'>
                            <img src={EchoEvent}
                                className='img-fluid' />
                        </div>
                        <div className='search-contact-event'>
                            <SearchIn
                                searchQuery={searchQuery}
                                handleSearchChange={handleSearchChange}
                            />
                            <div>
                                <img src={Vector} className='img-fluid contact-event mt-1' />
                            </div>
                        </div>
                    </div>

                </div>
                <div className='Event-side'>
                    <div className='event-text'>
                        <h3>Events</h3>
                        <p>View and Manage Every Event of Future</p>
                    </div>
                    {/* <button className='sort-event-btn'>
                        <div className='event-filter-layout'>
                            <div>
                                <img src={SortView} />
                            </div>
                            <div>
                                <p>Filter</p>
                            </div>

                        </div>
                    </button> */}
                    <div className='manage-button-add-edit-filter'>
                        <div className="filter-container" style={{ position: "relative", display: "inline-block" }}>
                            <button className='filter-btn sort-event-btn' onClick={toggleFilterMenu}>
                                <div className='d-flex'>
                                    <div>
                                        <img src={SortView} />
                                    </div>
                                    <div className='filter-event-button'>
                                        <p>Filter</p>
                                    </div>
                                </div>
                            </button>

                            {/* 🔽 Filter Options ListGroup Component */}
                            {showFilterOptions && (
                                <ListGroup items={filterOptions} onSelectItem={handleFilterChange} />
                            )}
                        </div>
                        <button className="list-event-btn">
                            <div>
                                {
                                    listview ? (
                                        <>
                                            <div onClick={handleListViewClose} className='event-filter-layout'>
                                                <div>
                                                    <img src={CardView}
                                                    />
                                                </div>
                                                <div>
                                                    <p className='event-card-p'>card view</p>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div onClick={handleListView} className='event-filter-layout'>
                                                <div>
                                                    <img src={ListView}

                                                    />
                                                </div>
                                                <div>
                                                    <p className='event-list-p'>list view</p>
                                                </div>
                                            </div>
                                        </>
                                    )

                                }
                            </div>
                        </button>
                        <button className="add-event-btn" onClick={handleOpenModal}>
                            Add Event <FaPlus
                                style={{ color: "white" }}
                            />
                        </button>
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
                {/* <div className='footer-btn mb-3'>
                    <div>
                        <button className='btn-previous'>Previous</button>
                    </div>
                    <div>
                        <img src={pagination} />
                    </div>
                    <div>
                        <button className='btn-previous'>Next</button>
                    </div>
                </div> */}
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
