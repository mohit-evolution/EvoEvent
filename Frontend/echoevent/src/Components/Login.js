import './Login.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { EyeImage, RemeberMeImage } from '../share/image';
import api from '../axiosInstane';
const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Invalid email address').required('Email is Required'),
            password: Yup.string()
                .min(5, "minimum 5 character")
                .max(50, 'Maximum  15 character')
                .required('Password is Required'),
        }),
        onSubmit: (values) => {
            const logindata = {
                email: values.email,
                password: values.password
            }
            handleLogin(logindata)
        },
    });

    const handleLogin = async (logindata) => {
        try {
            const reasponse = await api.post(`/api/auth/login`, logindata)
            console.log(reasponse)
            localStorage.setItem("echotoken", reasponse.data.token)
            alert("User Login Successfully");
            navigate('/eventlist')
        }
        catch (error) {
            console.log(error)
        }

    }

    return (
        <div className='background-color d-flex justify-content-center align-items-center vh-100'>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4 col-sm-4 col-lg-4 mt-4">

                        <h3 className="text-center mb-2">Sign in to <span className='login-event-evo'>Evo</span><span className='login-event-evo-event'>Event</span></h3>
                        <div className='login-event-text'>
                            <p className='login-event-text-font'>Welcome to evento please enter your</p>
                            <p className='login-event-text-font-detail'>login details below</p>
                        </div>

                        <form onSubmit={formik.handleSubmit}>
                            <div className="mb-2 mt-2">
                                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                                <input type="email" className="d-form-control" id="exampleInputEmail1"
                                    placeholder="Enter email"
                                    name="email"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <div className='text-danger'>{formik.errors.email}</div>
                                ) : null}
                            </div>
                            <div className="mb-2 position-relative">
                                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                                <div className="input-group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="d-form-control"
                                        id="exampleInputPassword1"
                                        placeholder="Password"
                                        name="password"
                                        onChange={formik.handleChange}
                                        value={formik.values.password}
                                    />
                                    <span className='password-img-icon' onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                        {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                                        {showPassword ?
                                            (
                                                <>
                                                    <img src={EyeImage}
                                                    />
                                                </>
                                            ) :
                                            (
                                                <>
                                                    <img src={EyeImage} />
                                                </>
                                            )

                                        }
                                    </span>
                                </div>
                                {formik.touched.password && formik.errors.password ? (
                                    <div className='text-danger'>{formik.errors.password}</div>
                                ) : null}
                            </div>
                            <div className='mb-2'>
                                <img src={RemeberMeImage} />  <span>Remember me</span>
                            </div>
                            <button type="submit" className="login-btn w-100 mb-2">Login</button>
                            <p className='forget-text-design'>Forgot the password ?</p>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

