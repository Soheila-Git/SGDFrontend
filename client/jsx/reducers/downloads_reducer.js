/**
 * author: fgondwe
 * date: 05/05/2017
 * purpose: exexute action events for custom tree component
 */

import React from 'react';
import * as ActionTypes from '../actions/actionTypes';
import _ from 'underscore';


const initialState = {
    downloadsMenu: [],
    downloadsResults: [],
    query: '',
    selectedLeaf: '',
    selectedNodes: [],
    selectedNode:'',
    openNodes: {nodes:[],leaf:''},
    url: '',
    queryParams: '',
    tableColumns: [],
    nodeVisible: false,
};

export default function (state = initialState, action) {
    if (action.type === '@@router/UPDATE_LOCATION' && action.payload.pathname === '/downloads') {
        if (action.payload.search.length > 0) {
            debugger
            let regexString = /(^\?([a-zA-Z]|)+\=([\w*\+\w*])+(\&([\w*]+)+\=([\w*\+\w*])+)+)|^\?([a-zA-Z]|)+\=([\w*\+\w*])+/g;
            let result = (typeof action.payload.query.q === 'string') ? action.payload.search.match(regexString) : '';
            if (result) {
                state.query = action.payload.query.q;
            }
        }

        return state;
    }
    switch (action.type) {
        case ActionTypes.FETCH_DOWNLOADS_RESULTS_SUCCESS:
            return Object.assign({}, state, {
                downloadsResults: action.payload.datasets,
                query: { q: action.payload.searchTerm },
                selectedLeaf: action.payload.searchTerm,
                openNodes:{leaf:action.payload.searchTerm}
            });
        case ActionTypes.FETCH_DOWNLOADS_MENU:
            return Object.assign({}, state, {
                downloadsMenu: state.downloadsMenu.concat(action.payload.data)
            });
        case ActionTypes.GET_SELECTED_NODE:
        debugger
            return Object.assign({}, state, {
                selectedNodes: state.selectedNodes.concat(action.payload.node),
                selectedNode:action.payload.node,
                openNodes:{nodes:state.openNodes.concat(action.payload.node)}
            });

        default:
            return state;
    }
}
