from pyramid.config import Configurator
from pyramid.renderers import JSONP
from pyramid_jinja2 import renderer_factory
from sgdfrontend.link_maker import bioentity_overview_link
from sgdfrontend_utils import set_up_logging, get_bioent, get_json, clean_cell
from sgdfrontend_utils import link_maker
from sgdfrontend.models import get_root
from config import heritage_url
from pyramid.response import Response
import datetime
import json
import requests
import uuid
import urllib

class SGDFrontend():
    def __init__(self):
        self.log = set_up_logging('sgdfrontend')
        
    def get_renderer(self, method_name):
        if method_name in set(['home', 'download_table', 'download_citations']):
            return None
        elif method_name in set(['header', 'footer', 'enrichment']):
            return 'jsonp'
        else:
            return 'templates/' + method_name + '.jinja2'
    
    def response_wrapper(self, method_name, request):
        request_id = str(uuid.uuid4())
        self.log.info(request_id + ' ' + method_name + ('' if 'identifier' not in request.matchdict else ' ' + request.matchdict['identifier']))
        def f(data):
            self.log.info(request_id + ' end')
            return data
        return f
    
    def interaction_details(self, bioent_repr):
        print bioent_repr
        bioent = get_bioent(bioent_repr)
        bioent_id = str(bioent['id'])
        display_name = bioent['display_name']
        
        page = {
                    'interaction_overview_link': link_maker.interaction_overview_link(bioent_id),
                    'interaction_details_link': link_maker.interaction_details_link(bioent_id),
                    'interaction_graph_link': link_maker.interaction_graph_link(bioent_id),
                    'interaction_resources_link': link_maker.interaction_resources_link(bioent_id),
                    'tab_link': link_maker.tab_link(bioent_id),
    
                    'download_table_link': link_maker.download_table_link(),
    
                    'interaction_details_filename': display_name + '_interactions',
                    'interaction_overview_filename': display_name + '_interactors.png',
                    
                    'analyze_link': link_maker.analyze_link(),
                    
                    'display_name': bioent['display_name'],
                    'link': bioent['link'],
                    'format_name': bioent['format_name']
                    }
        return page
    
    def literature_details(self, bioent_repr):
        bioent = get_bioent(bioent_repr)
        bioent_id = str(bioent['id'])
        
        page = {
                    'literature_details_link': link_maker.literature_details_link(bioent_id),
                    'download_link': link_maker.download_citations_link(),
                    'tab_link': link_maker.tab_link(bioent_id),
                    'literature_overview_link': link_maker.literature_overview_link(bioent_id),
                    'literature_graph_link': link_maker.literature_graph_link(bioent_id),
                    'literature_overview_filename': bioent['display_name'] + '_literature_overview.png',
                       
                    'display_name': bioent['display_name'],
                    'format_name': bioent['format_name'],
                    'link': bioent['link']
                }
        return page
    
    def regulation_details(self, bioent_repr):
        bioent = get_bioent(bioent_repr)
        bioent_id = str(bioent['id'])
        display_name = bioent['display_name']
        page = {
                    'regulation_overview_link': link_maker.regulation_overview_link(bioent_id),
                    'regulation_details_link': link_maker.regulation_details_link(bioent_id),
                    'regulation_graph_link': link_maker.regulation_graph_link(bioent_id),
                    'regulation_target_enrichment_link': link_maker.regulation_target_enrichment_link(bioent_id),
                    'protein_domain_details_link': link_maker.protein_domain_details_link(bioent_id),
                    'binding_site_details_link': link_maker.binding_site_details_link(bioent_id),
                    'tab_link': link_maker.tab_link(bioent_id),
        
                    'download_table_link': link_maker.download_table_link(),
    
                    'targets_filename': display_name + '_targets',
                    'regulators_filename': display_name + '_regulators',
                    'domains_filename': display_name + '_domains',
                    'enrichment_filename': display_name + '_targets_go_process_enrichment',
                    'regulation_overview_filename': display_name + '_transcriptional_targets_and_regulators.png',
                    
                    'analyze_link': link_maker.analyze_link(),
                    'go_enrichment_link': link_maker.enrichment_link(),
                    
                    'display_name': bioent['display_name'],
                    'link': bioent['link'],
                    'format_name': bioent['format_name']
                    }
        return page
    
    def home(self):
        page = urllib.urlopen(heritage_url).read()
        return Response(page)
    
    def header(self):
        header_str = render('templates/header.jinja2', {})
        return {'header': header_str}

    def footer(self):
        footer_str = render('templates/footer.jinja2', {})
        return {'footer': footer_str}
    
    def download_table(self, response, header_info, data, display_name):
        headers = response.headers
        
        date = datetime.datetime.now().strftime("%m/%d/%Y")
        description = "!\n!Date: " + date + '\n' + "!From: Saccharomyces Genome Database (SGD) \n!URL: http://www.yeastgenome.org/ \n!Contact Email: sgd-helpdesk@lists.stanford.edu \n!Funding: NHGRI at US NIH, grant number 5-P41-HG001315 \n!"
        
        table_header = description + '\n\n' + '\t'.join(header_info)
        
        response.text = table_header + '\n' + '\n'.join(['\t'.join([clean_cell(cell) for cell in row]) for row in data])
        
        headers['Content-Type'] = 'text/plain'      
        headers['Content-Disposition'] = str('attachment; filename=' + display_name + '.txt')
        headers['Content-Description'] = 'File Transfer'
        return response
    
    def download_citations(self, response, reference_ids, display_name):
        reference_ids = list(set(reference_ids))
        references = get_json(link_maker.citation_list_link(), data={'reference_ids': reference_ids})
        
        headers = response.headers
        
        response.text = '\n' + '\n\n'.join([ref['text'] for ref in references])
        
        headers['Content-Type'] = 'text/plain'        
        headers['Content-Disposition'] = str('attachment; filename=' + display_name + '.nbib')
        headers['Content-Description'] = 'File Transfer'
        return response
    
    def analyze(self, list_name, bioent_display_name, bioent_format_name, bioent_link, bioent_ids):
        bioent_ids = list(set([int(x) for x in bioent_ids]))
            
        bioents = get_json(link_maker.bioent_list_link(), data={'bioent_ids': bioent_ids})
    
        if bioents is None:
            return Response(status_int=500, body='Bioents could not be found.') 
        
        page = {    'bioent_display_name': bioent_display_name,
                    'bioent_format_name': bioent_format_name,
                    'bioent_link': bioent_link,
                    'go_enrichment_link': link_maker.enrichment_link(),
                    'bioents': json.dumps(bioents),
                    'bioent_format_names': " ".join([bioent['format_name'] for bioent in bioents]), 
                    'gene_list_filename': 'gene_list',
                    'list_type': list_name,
                    'download_table_link': link_maker.download_table_link(),
                }
        return page
    
    def enrichment(self, bioent_ids):
        enrichment_results = get_json(link_maker.go_enrichment_link(), data={'bioent_ids': bioent_ids})
        return enrichment_results
    
def prepare_sgdfrontend(**configs):  
    chosen_frontend = SGDFrontend()
    
    settings = dict(configs)
    settings.setdefault('jinja2.i18n.domain', 'myproject')
    config = Configurator(settings=settings)
    config.add_translation_dirs('locale/')
    config.include('pyramid_jinja2')
    
    config.add_static_view('static', 'sgdfrontend:static')
    config.add_renderer('jsonp', JSONP(param_name='callback'))
    
    return chosen_frontend, config
