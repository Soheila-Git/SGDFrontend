/**
 * author: fgondwe
 * date: 05/05/2017
 * purpose: manage events for custom tree component
 */
import * as URLS from '../lib/downloads_helper';
import Axios from 'axios';
import * as ActionTypes from './actionTypes';
import _ from 'underscore';

export const fetchDownloadResultsSuccess = (results) => {
    return {
        type: ActionTypes.FETCH_DOWNLOADS_RESULTS_SUCCESS,
        payload: results
    };
};

export const fetchDownloadsMenuSuccess = (results) => {
    return {
        type: ActionTypes.FETCH_DOWNLOADS_MENU,
        payload: results
    };
};

export function fetchDownloadsMenuData(){
      return (dispatch) => {
        return Axios.get(URLS.menuUrl)
            .then(response => {
                dispatch(fetchDownloadsMenuSuccess(response))
            })
            .catch(error => { throw (error) });
    };
};

export const fetchDownloadResults = (searchTerm) => {

    return (dispatch) => {
        return Axios.get(URLS.resultsUrl)
            .then(response => {
                dispatch(fetchDownloadResultsSuccess({datasets:response.data,searchTerm:searchTerm}));
            }).catch(error => { throw (error) });
    };
};

export const getNode = (node) => {
    return {
        type:ActionTypes.GET_SELECTED_NODE,
        payload:{node:node}
    }

};

export const getLeaf = (leafKey,list) => {
     return (dispatch) =>{
        return dispatch(_.findWhere(list,{key:leafKey}));
    }
};

export const deleteLeaf = (leafKey,list) => {
    return (dispatch)=>{
        return dispatch(_.without(list, _.findWhere(list,{key:leafKey})));
    }

};

export const deleteNode = (key,list) => {
    return (dispatch)=>{
        return dispatch(_.without(list, _.findWhere(list,{key:key})));
    }
};

export const toggleNode = (flag,node)=>{
    return {
        type:ActionTypes.GET_SELECTED_NODE,
        payload: {flag:flag,node:node}
    }
};


