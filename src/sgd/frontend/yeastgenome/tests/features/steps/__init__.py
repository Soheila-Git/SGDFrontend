__author__ = 'kpaskov'

from behave import step
from selenium.common.exceptions import NoSuchElementException

@step('I visit "{url}" for "{obj}"')
def visit_page_for(context, url, obj):
    context.browser.get(context.base_url + url.replace('?', obj))

@step('I click the button with id "{button_id}"')
def click_button_with_id(context, button_id):
    try:
        button = context.browser.find_element_by_id(button_id)
        button.click()
    except NoSuchElementException:
        assert 0, 'No element with id ' + button_id

@step('I should see an element with id "{element_id}"')
def should_see_element_with_id(context, element_id):
    try:
        context.browser.find_element_by_id(element_id)
    except NoSuchElementException:
        assert 0, 'No element with id ' + element_id

@step('I should see an element "{element_id}" with text "{text}"')
def should_see_element_with_id_with_text(context, element_id, text):
    try:
        element = context.browser.find_element_by_id(element_id)
        assert element.text == text, 'Text does not match: ' + element.text
    except NoSuchElementException:
        assert 0, 'No element with id ' + element_id

@step('the title should be "{title}"')
def title_should_be(context, title):
    assert context.browser.title == title, 'Wrong title'

@step('the table with id "{table_id}" should have rows in it')
def table_should_have_rows(context, table_id):
    try:
        num_rows = len(context.browser.find_elements_by_xpath("//table[@id='" + table_id + "']/tbody/tr"))
        assert num_rows > 1, 'Only ' + str(num_rows) + ' entries in table.'
    except NoSuchElementException:
        assert 0, 'No element with id.'

@step('the reference list with id "{reference_list_id}" should have rows in it')
def reference_list_should_have_rows(context, reference_list_id):
    try:
        num_rows = len(context.browser.find_elements_by_xpath("//ul[@id='" + reference_list_id + "']/li"))
        assert num_rows > 1, 'Only ' + str(num_rows) + ' entries in reference list.'
    except NoSuchElementException:
        assert 0, 'No element with id.'

@step('the resource list with id "{resource_list_id}" should have rows in it')
def resource_list_should_have_rows(context, resource_list_id):
    try:
        num_rows = len(context.browser.find_elements_by_xpath("//p[@id='" + resource_list_id + "']/a"))
        assert num_rows > 0, 'Only ' + str(num_rows) + ' entries in resource list.'
    except NoSuchElementException:
        assert 0, 'No element with id.'

@step('the network with id "{network_id}" should appear')
def network_should_appear(context, network_id):
    try:
        assert len(context.browser.find_elements_by_xpath("//div[@id='" + network_id + "']/div/canvas")) == 7, 'Network not drawn.'
    except NoSuchElementException:
        assert 0, 'No element with id.'

@step('the button with id "{button_id}" should be disabled')
def button_with_id_should_be_disabled(context, button_id):
    try:
        button = context.browser.find_element_by_id(button_id)
        assert button.get_attribute('disabled'), 'Button is not disabled.'

        old_title = context.browser.title
        button.click()
        assert context.browser.title == old_title, 'Disabled button took us to a different page.'

    except NoSuchElementException:
        assert 0, 'No element with id ' + button_id

@step('I should download a file named "{filename}"')
def download_a_file_named(context, filename):
    pass

@step('I wait {num_sec} seconds')
def wait(context, num_sec):
    from time import sleep
    sleep(float(num_sec))
    assert True