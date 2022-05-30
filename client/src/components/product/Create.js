import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import {connect } from 'react-redux'
import {addItem} from '../../actions/item'

const CreateItem = ({addItem}) => {
    const [name, setName]= useState('')
    const [video, setVideo]= useState('')
    const [notes, setNotes]= useState('')
    
    return (
        <div class="post-form">
        <div class="bg-primary p">
          <h3>Add New Item</h3>
        </div>
        <form class="form my-1" onSubmit={e=>{
            e.preventDefault();
            addItem();
            setName('');
        }}>
            <div className='form-group'>
                <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
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
          <input type="text" name='name' value={name} />
          <input type="file" name='video' value={video} />
          <input type="file" name='notes' value={notes} />
          <input type="submit" class="btn btn-dark my-1" value="Submit" />
        </form>
      </div>
    )
}

CreateItem.propTypes = {
    addItem: PropTypes.func.isRequired
}

export default connect(null, {addItem})(CreateItem)
