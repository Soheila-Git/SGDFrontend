import { createMemoryHistory, useQueries } from 'history';
import _ from 'underscore';
const SEARCH_URL = '/search';

export function getCategoryDisplayName (key) {
  const labels = {
    locus: 'Gene',
    reference: 'Reference',
    cellular_component: 'Cellular Component',
    molecular_function: 'Molecular Function',
    biological_process: 'Biological Process',
    phenotype: 'Phenotype',
    strain: 'Strain',
    author: 'Author',
    download: 'Download',
    resource: 'Resource',
    contig: 'Contig',
    colleague: 'Colleague'
  };
  return labels[key] || key;
};

// proxy the history createPath, but create a temp history object.  Ideally, this would be a class method import, but it's not.
// obj = { pathname: SEARCH_URL, query: newQp }
export function createPath(obj) {
  const tempHistory = useQueries(createMemoryHistory)();
  return tempHistory.createPath(obj);
};

// create the href that would be true if you toggled the current value
export function getHrefWithoutAgg (queryParamsObject, aggKey, thisValue, currentValues, isReset) {
  let newActiveVals = currentValues.slice(0);
  let isActive = (currentValues.indexOf(thisValue) > -1);
  // clear this key if thisValue is blank (likely a react-select clear)
  if (isReset) {
    newActiveVals = thisValue;
  } else if (isActive) {
    newActiveVals = _.without(currentValues, thisValue);
  } else {
    newActiveVals.push(thisValue);
  }
  let newQp = _.clone(queryParamsObject);
  newQp[aggKey] = newActiveVals;
  // reset pagintion
  newQp.page = 0;
  // Create a little history object to use the createPath method. 
  return createPath({ pathname: SEARCH_URL, query: newQp });
};

// Allow some facets to have different names than the key.  If it's not one of the whitelisted changes, just returns the key without _.
export function getFacetName (key) {
  switch (key) {
    case 'colleague_loci':
      return 'Genes of Interest';
      break;
    case 'go_locus':
    case 'reference_locus':
    case 'phenotype_locus': 
      return 'Associated Genes';
      break;
    default:
      return key.replace('_', ' ');
  }
};
