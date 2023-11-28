import Card from "../UI/Card";
import Applicant from "./Applicant";




const ApplicantsList = props => {

    const removeHandler = id => {
        props.removeHandler(id);
    }

    // Create applicant components from applicants list.

    const applicantsList = props.applicants.map(app => {
        return <Applicant
            key={app._id}
            id={app.id}
            name={app.name}
            email={app.email}
            phone={app.phone}
            linkedin={app.linkedin}
            _id={app._id}
            skills={app.skills}
            removeHandler={removeHandler}
        />;
    }).reverse()

    return (
        <Card cardType='card'>
            <h1>APPLICANTS LIST </h1>
            {applicantsList}
        </Card>
    )


}


export default ApplicantsList;