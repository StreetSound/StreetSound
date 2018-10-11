import React, { Component } from 'react';
// import api from '../api';
import axios from 'axios';



// addPicture(file){
//     const formData = new FormData();
//     formData.append("picture", file)
//     console.log('DEBUG formData', formData.get("picture"));
//     return service
//       .post('/profile', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       })
//       .then(res => console.log(res.data))
//       .catch();
//   };

///----------------------------------------- 

class AddPhotoPrueba extends Component{
    constructor(props) {
        super(props)
        this.state = {
            selectedFile: null
        }
    }


    //---------------------------------------
    // handleChange(e) {
    //     console.log('handleChange');
    //     console.log('DEBUG e.target.files[0]', e.target.files[0]);
    //     this.setState({
    //         selectedFile: e.target.files[0]
    //     })
    //   }
    //   handleSubmit(e) {
    //     e.preventDefault()
    //     api.addPicture(this.state.selectedfile)
    //   }

    ///--------------------------------------------------------
    filesSelectHandler = event=> {
 this.setState({selectedFile : event.target.files[0]})
    }

    filesUploadHandler = ()=>{
        const fd= new FormData();
        fd.append('image', this.state.selectedFile, this.state.selectedFile.name)
        // axios.post("http://res.cloudinary.com/dz4mjhdbf/image/upload/v1537961966/folder-name/placeholder.jpg.jpg")
        axios.post("http://res.cloudinary.com/dz4mjhdbf/image/upload/v1537961966/folder-name/placeholder.jpg.jpg", fd)
        .then(res=>{
            console.log(res)
        })
    }
/////---------------------------------------------------------
  
    render(){
         return(
            <div>
             <input type = "file" onChange = {this.filesSelectHandler}/>
             <button onClick = {this.filesUploadHandler}>upload</button>
         </div>
        

         
        //  <form onSubmit={(e)=>this.handleSubmit(e)}>
        //   <input type="file" onChange={(e)=>this.handleChange(e)} /> <br/>
        //   <button type="submit">Save new profile picture</button>
        // </form> 
      
        )

    }
}

export default AddPhotoPrueba;

