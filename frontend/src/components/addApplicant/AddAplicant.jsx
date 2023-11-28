import Card from "../UI/Card";
import UploadFile from "../upload/UploadFile";



const AddAplicant = props =>{
    
    const reloadList = () =>{
        props.reload();
    }

    return(
        <Card CardType = "inner-card">
            <h2> ADD NEW APPLICANT</h2>
            <UploadFile reload = {reloadList} toggle = {props.toggle}/>

        </Card>
    )

}

export default AddAplicant;