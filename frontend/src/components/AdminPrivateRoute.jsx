import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminPrivateRoute = ({children}) => {
    const authToken=localStorage.getItem("adminToken");
    return authToken? children :<Navigate to="/"/>
}

export default AdminPrivateRoute;
