import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import {connect } from 'react-redux'
import {addItem, saveMedia} from '../../actions/item'

const CreateItem = ({addItem, item, saveMedia}) => {

    const [formData, setFormData]=useState({
        name:''
    });

    const {
        name
      } = formData;

    const onChange=(e)=>{setFormData({...formData, [e.target.name]: e.target.value})}
    const handleDrop = file => {
        let formData = new FormData();
        const config = {
            header: {
                'content-type': 'multipart/form-data'
            }
        }
        formData.append("file", file[0]);
        saveMedia(formData, config);
    }
    
    return (
        <div class="post-form">
            <div class="bg-primary p">
                <h3>Add New Item</h3>
            </div>
            <form class="form my-1" onSubmit={e=>{
                e.preventDefault();
                addItem();
            }}>
                <div className='form-group'>
                    <input type="text" className='form-control' name='name' value={name} onChange={e=>onChange(e)}/>
                </div>
                <div className='form-group'>
                    <Dropzone multiple={false} onDrop={acceptedFiles => handleDrop(acceptedFiles)}>
                    {({getRootProps, getInputProps}) => (
                        <section>
                        <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p>Drag 'n' drop some files here, or click to select files</p>
                        </div>
                        </section>
                    )}
                    </Dropzone>
                </div>
                <input type="submit" class="btn btn-dark my-1" value="Submit" />
            </form>
        </div>
    )
}

CreateItem.propTypes = {
    addItem: PropTypes.func.isRequired
}

const mapStateToProps= state=>({
    item: state.item
})

export default connect(mapStateToProps, {addItem, saveMedia})(CreateItem)
