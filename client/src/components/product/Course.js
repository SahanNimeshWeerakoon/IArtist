import React from 'react'
import {Link} from'react-router-dom';
import { deleteItem } from '../../actions/item';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

const Course = ({course, deleteItem}) => {
    
    const handleDelete = (id) => {
        deleteItem(id);
    }

    return (
        <div className="post bg-white p-1 my-1 d-flex">
            <div>
                <Link to={`/items/${course._id}`}>
                    <h4>{course.name}</h4>
                </Link>
            </div>
            <div>
                <p>
                    {course.video}
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="btn btn-danger" onClick={() => { handleDelete(course._id) }}>Delete</button>      
                </p>     
            </div>
        </div>
    )
};

Course.propTypes = {
    getItem: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    match: PropTypes.string.isRequired
}

const mapStateToProps =state => ({
    item: state.item
})

export default connect(mapStateToProps, {deleteItem})(Course);
