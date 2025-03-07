import './Event.css';
import { FaPlus } from "react-icons/fa6";
import { useState, useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { EditIcon, DeleteIcon, ListView, SortView, EchoEvent, Vector, Search, DeleteImage, Previousbutton, pagination } from '../share/image';
import axios from 'axios'
import SearchIn from './Search';
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

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/events/getEvent`);
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
            await axios.delete(`http://localhost:5000/api/events/deleteEvent/${eventId}`);
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
                        headers: { "Content-Type": "multipart/form-data" },
                    });
                } else {

                    await axios.post("http://localhost:5000/api/events/addEvent", formData, {
                        headers: { "Content-Type": "multipart/form-data" },
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
                    <button className='sort-event-btn'>
                        <div className='event-filter-layout'>
                            <div>
                                <img src={SortView} />
                            </div>
                            <div>
                                <p>Filter</p>
                            </div>

                        </div>
                    </button>
                    <button className="list-event-btn">
                        <div className='event-filter-layout' onClick={handleListView}>
                            <div>
                                <img src={ListView}
                                />
                            </div>
                            <div>
                                <p>List</p>
                            </div>

                        </div>

                    </button>
                    <button className="add-event-btn" onClick={handleOpenModal}>
                        Add Event <FaPlus
                            style={{ color: "white" }}
                        />
                    </button>

                </div>
                {

                    listview ? (
                        <>
                            <ListViewIn
                            filteredEvents={filteredEvents}
                            handleEdit={handleEdit}
                            handleDeleteModel={handleDeleteModel}
                            />

                        </>
                    ) :
                        (
                            <>
                                <div className="row mt-3">
                                    {filteredEvents.length > 0 ? (
                                        filteredEvents?.map((event) => (
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
                                        <p className="text-center">No events found</p>
                                    )}
                                </div>

                            </>
                        )
                }
                {/* <div className="row mt-3">
                    {filteredEvents.length > 0 ? (
                        filteredEvents?.map((event) => (
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
                        <p className="text-center">No events found</p>
                    )}
                </div> */}


                <div className='footer-btn mb-3'>
                    <div>
                        <button className='btn-previous'>Previous</button>
                    </div>
                    <div>
                        <img src={pagination} />
                    </div>
                    <div>
                        <button className='btn-previous'>Next</button>
                    </div>
                </div>
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
