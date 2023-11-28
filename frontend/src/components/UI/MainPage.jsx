import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import ApplicantsList from "../applicants/ApplicantsList";
import AddAplicant from "../addApplicant/AddAplicant";
import { network, API_URL } from "../../helpers/utils";



// React component for the main page
const Mainpage = () => {
    // State variable to toggle the "Add User" section
    const [toggleAddUser, setToggleAddUser] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [reload, setRelaod] = useState(false);

    // Get all applicant Data.
    useEffect(() => {
        network(`${API_URL}/`, 'GET', {}, { 'Content-Type': 'application/json' })
            .then(res => {
                setApplicants(res.data);
            }).catch(err => {
                console.error(err);
            });

    }, [reload]);

    // toggle add applicant
    const toggleHandler = () => {
        setToggleAddUser(prev => !prev);
    }

    // Handle remove applicant from the system
    const removeHandler = id => {
        network(`${API_URL}/delete/${id}`, 'DELETE', {}, {}).then(res => {
            alert("Applicant successfully deleted.")
            reloadList();
        }).catch(err => console.error(err));

    }
    const reloadList = () => {
        setRelaod(perv => !perv);
    }

    return (
        <>
            {/* Conditional rendering based on the toggle state */}
            {!toggleAddUser ? (
                <Button variant="contained" style={{ "marginTop": "10px" }} size="large" onClick={toggleHandler}>Add new Applicant</Button>
            ) : (
                <Button variant="contained" style={{ "marginTop": "10px" }} size="large" onClick={toggleHandler}>Close</Button>
            )}

            {/* Render the "AddApplicant" component when toggleAddUser is true */}
            {toggleAddUser && <AddAplicant reload={reloadList} toggle={toggleHandler} />}

            {/* Render the "ApplicantsList" component */}
            <ApplicantsList applicants={applicants} removeHandler={removeHandler} />
        </>
    );
};

export default Mainpage;

