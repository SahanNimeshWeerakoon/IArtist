import React, {Fragment, useEffect} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';

import {getItem} from '../../actions/item'

const ViewCourse = ({getItem, item, match}) => {
    useEffect(()=>{
        getItem(match.params.id);
        console.log(item);
    },[getItem]);
    return (
        <Fragment>
            <Link to ='/view-items' classname ='btn'>Back to items</Link>
            <h1>{item.name}</h1>
            <video width="400" controls>
                <source src={`../../../..${item.video}`} type="video/mp4" />
                Your browser does not support HTML video.
            </video>
        </Fragment>
    )
}

const mapStateToProps =state => ({
    item: state.item
})

export default connect(mapStateToProps, {getItem})(ViewCourse)
