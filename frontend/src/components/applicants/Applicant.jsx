import { Button } from "@mui/material";
import Card from "../UI/Card";
import styles from './Applicant.module.css';
import { API_URL } from "../../helpers/utils";
import { useState } from "react";

const Applicant = (props) => {
    const MAX_DISPLAY_SKILLS = 5;
    const [isExpanded, setIsExpanded] = useState(false);

    const clickHandler = (e) => {
        props.removeHandler(props._id);
    }

    // Handle download request.

    const handleDownload = async () => {
        try {
            const response = await fetch(`${API_URL}/download/${props._id}`);

            if (!response.ok) {
                console.error('File download failed:', response.statusText);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${props.name}-${props._id}-Resume.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    // toggle full skills list
    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    const displayedSkills = isExpanded ? props.skills : props.skills.slice(0, MAX_DISPLAY_SKILLS);


    return (
        <Card cardType='inner-card'>
            <li className={styles['list-item']}>

                {/* Showing applicant data */}

                <div className={styles['info-container']}>
                    <h4>Name:   {props.name}</h4>
                    <h4>ID: {props.id}</h4>
                    <h4>Phone: {props.phone}</h4>
                    <h4>Email: {props.email}</h4>
                    <h4>Linkedin: <a href={props.linkedin}>{props.linkedin}</a></h4>
                    <div className={styles['skills-container']}>
                        <h4>Skills:</h4>
                        <ul>
                            {displayedSkills.map((skill, index) => (
                                <li key={index}>{skill}</li>
                            ))}
                        </ul>
                        {props.skills.length > MAX_DISPLAY_SKILLS && (
                            <Button onClick={toggleExpand}>
                                {isExpanded ? "Show Less" : "Show More"}
                            </Button>
                        )}
                    </div>
                </div>
                <div className={styles['button-container']}>

                    {/*Remove applicant || download resume */}

                    <Button id="remove" variant="contained" onClick={clickHandler} >Remove</Button>
                    <Button id="download" variant="contained" onClick={handleDownload} >Download</Button>
                </div>
            </li>
        </Card >
    );

};

export default Applicant;