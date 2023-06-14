import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate} from "react-router-dom";

const VALIDATE_STATE = {
    IDLE: 'idle',
    VALIDATED: 'validated',
    PENDING: 'pending',
    REJECTED: 'rejected'
}

const ProtectedRoute = ({children}) => {
    const [isValidated, setIsValidated] = useState(VALIDATE_STATE.IDLE)

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        const validateToken = async (token) => {
            try {
                setIsValidated(VALIDATE_STATE.PENDING)
                const res = await axios.get("/api/user/validate-token", {
                    headers: {
                        Authorization: token,
                    },
                });

                setIsValidated(VALIDATE_STATE.VALIDATED)
                console.log("Token is valid", res);
            } catch (error) {
                setIsValidated(VALIDATE_STATE.REJECTED)
                console.error("Token is invalid or not provided");
            }
        };

        if (user?.token) {
            validateToken(user?.token);
        } else {
            setIsValidated(VALIDATE_STATE.REJECTED)
        }
    }, []);

    return (
        <>
            {/* CAN REPLACE <div>IDLE</div> with custome component for IDLE STATE */}
            {isValidated === VALIDATE_STATE.IDLE && <div>IDLE</div>}
            {/* CAN REPLACE <div>IDLE</div> with custome component for PENDING STATE */}
            {isValidated === VALIDATE_STATE.PENDING && <div>PENDING</div>}
            {isValidated === VALIDATE_STATE.VALIDATED && children}
            {isValidated === VALIDATE_STATE.REJECTED && <Navigate to='/main' />}
        </>
    );
};

export default ProtectedRoute;
