import { Button } from "@mui/material";
import Card from "../UI/Card";
import CircularProgress from "@mui/material/CircularProgress";
const { useState } = require("react");
const { network, API_URL } = require("../../helpers/utils");


const UploadFile = props => {

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const fileChangeHandler = (event) => {
        setFile(event.target.files[0]);
        console.log(file);
    }


    const submitHandler = event => {
        event.preventDefault();
        console.log(file)
        if (file != null && file.type === "application/pdf") {

            setLoading(true);
            const fileData = new FormData();
            fileData.append('file', file);

            network(`${API_URL}/uploadcv`, "POST", fileData)
                .then((res) => {
                    console.log(res);
                    setLoading(false);
                    props.toggle();
                    props.reload();
                }).catch((err) => {
                    console.log(err);
                    alert("Resume upload faild.")
                })
        } else {
            alert("Must contain valid file !")
        }

    }



    return (
        <>
            <Card type="inner-card">
                <form onSubmit={submitHandler}>

                    <input type="file" onChange={fileChangeHandler} accept=".pdf" />
                    <Button type="submit">Upload</Button>
                    <h2>{loading && <div> <h3>Uploading and analyzing resume</h3><CircularProgress size={24} color="inherit" /></div>}</h2>
                </form>
            </Card>
        </>
    )


}

export default UploadFile;