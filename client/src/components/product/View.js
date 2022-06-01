import React, {Fragment, useEffect} from 'react'
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Spinner from '../layout/Spinner';
import Course from './Course';


import {getItems} from '../../actions/item'

const Items = ({getItems, item}) => {
    useEffect(()=>{
        getItems();
    },[])

    // return loading? (<Spinner/>) : (<Fragment>
    return (<Fragment>
        <h1 className='large text-primary'>Cources</h1>
        <p className='lead'>
            <i className="fas fa-user"></i> Welcome to the community
        </p>

        <div className='posts'>
            {item.items.map(course=> (
                <Course key={course._id} course={course}/>
            ))}
        </div>

    </Fragment>)
}

const mapStateToProps= state=>({
    item: state.item
})

export default connect(mapStateToProps, {getItems})(Items)
