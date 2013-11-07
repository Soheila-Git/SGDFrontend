from pyramid.config import Configurator
from pyramid.renderers import JSONP
from pyramid_jinja2 import renderer_factory
from link_maker import bioentity_overview_link, phenotype_link, go_overview_link
from sgdfrontend.models import get_root
from datetime import datetime
import logging
import json
import requests

def get_json(url, data=None):
    if data is not None:
        headers = {'Content-type': 'application/json; charset=utf-8"', 'processData': False}
        r = requests.post(url, data=json.dumps(data), headers=headers)
    else:
        r = requests.get(url)
    return r.json()

def get_bioent(bioent_repr):
    bioent = get_json(bioentity_overview_link(bioent_repr))
    if bioent is None:
        raise Exception('Bioentity not found.')
    return bioent   

def get_phenotype(biocon_repr):
    biocon = get_json(phenotype_link(biocon_repr))
    if biocon is None:
        raise Exception('Bioconcept not found.')
    return biocon   

def get_go(biocon_repr):
    biocon = get_json(go_overview_link(biocon_repr))
    if biocon is None:
        raise Exception('Bioconcept not found.')
    return biocon      

def set_up_logging(label):
    logging.basicConfig(format='%(asctime)s %(name)s: %(message)s', level=logging.INFO)
    log = logging.getLogger(label)
    
    hdlr = logging.FileHandler('sgdfrontend_logs/' + label + '.' + str(datetime.now().date()) + '.txt')
    formatter = logging.Formatter('%(asctime)s %(name)s: %(message)s')
    hdlr.setFormatter(formatter)
    log.addHandler(hdlr) 
    log.setLevel(logging.INFO)
    return log

def clean_cell(cell):
    if cell is None:
        return ''
    elif cell.startswith('<a href='):
        cell = cell[cell.index('>')+1:]
        cell = cell[:cell.index('<')]
        return cell
    else:
        return cell