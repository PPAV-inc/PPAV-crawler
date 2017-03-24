import re
from urllib import parse
import urllib.request

# global function
def parse_webpage(url):
    scheme, netloc, path, query, fragment = parse.urlsplit(url)
    path = parse.quote(path, encoding='utf-8')
    url = parse.urlunsplit((scheme, netloc, path, query, fragment))
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla 7.0'})
    page = urllib.request.urlopen(req).read().decode('utf-8')
    return page


def get_code_info(video_code):
    page_indexav = parse_webpage('https://indexav.com/search?keyword=' + video_code)

    return_obj = {}

    model_re = '<span class=\"video_actor\".*?>(.*)</span>'
    model = re.search(model_re, page_indexav)
    if model is None:
        return_obj['model'] = None
    else:
        return_obj['model'] = re.sub('<.*?>', '', model.group())

    video_title_re = '<span class=\"video_title\".*?>(.*)</span>'
    video_title = re.search(video_title_re, page_indexav)
    if video_title is None:
        return_obj['video_title'] = None
    else:
        return_obj['video_title'] = re.sub('<.*?>', '', video_title.group())

    img_re = '(?<=<span class=\"preview_btn\" rel=\").*(?=\" who=\".*?\")'
    img = re.search(img_re, page_indexav)
    if img is None:
        return_obj['img'] = None
    else:
        return_obj['img'] = img.group()

    return return_obj
