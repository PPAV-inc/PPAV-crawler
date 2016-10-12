import re
import json
import os.path
from parser_link import parse_webpage

class Parser_img():
    
    def __init__(self, file_path):
        self.file_path = file_path
        self.film_infos = []

    def parse_img_start(self):
        file_path = self.file_path
        input_json = json.load(open(file_path))
        
        for obj in input_json:
          page_film = parse_webpage(obj['url'])
          
          img_url_re = '<img itemprop=\"image\" src=\"(.*?)\" title=\"'
          img_url_str = re.search(img_url_re, page_film).group(1)
          obj['img_url'] = img_url_str
          self.film_infos.append(obj)
          with open('../public/film_info_2.json', 'w+') as fp:
            json.dump(self.film_infos, fp, ensure_ascii=False, indent=2)
            print(img_url_str)

        print("parse file images finished!")

if __name__ == '__main__':
    file_path = '../public/film_info.3.json'
    parser = Parser_img(file_path)
    parser.parse_img_start()

