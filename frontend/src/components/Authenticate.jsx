import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resetUser } from "../features/user/userSlice";

import { authenticate } from "../features/user/userSlice";
import { useDispatch } from "react-redux";


const AuthVerify = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        // const user = JSON.parse(localStorage.getItem("user"));
        // // console.log('this is the token', JSON.parse(atob(user.token.split('.')[1])).exp < new Date())

        // if (user !== null && JSON.parse(atob(user.token.split('.')[1])).exp < new Date()) {
        //     localStorage.removeItem('user')
        //     navigate('/main')
        // }
        dispatch(authenticate())
        resetUser()
        navigate('/main')
    // if (user) {
    //   const decodedJwt = parseJwt(user.accessToken);

    //   if (decodedJwt.exp * 1000 < Date.now()) {
    //     props.logOut();
    //   }
    // }
    }, [dispatch]);

  return <div></div>;
};

export default AuthVerify