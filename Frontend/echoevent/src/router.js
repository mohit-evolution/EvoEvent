import {createBrowserRouter} from 'react-router-dom'
import Login from './Components/Login'
import EventList from './Components/EventList';
export const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
     
    //   children: [
    //     {
    //         path: 'eventlist',
    //       element: <EventList/>,
    //     },
    //   ],
    },
    {
        path:'/eventlist',
        element:<EventList/>
    }
  ]);