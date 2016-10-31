# The wget module
import wget

# The BeautifulSoup module
from bs4 import BeautifulSoup
# The selenium module
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from pyvirtualdisplay import Display
display = Display(visible=0, size=(1024, 768))
display.start()

tst_url = "http://xonline.vip/watch-hodv-21199-lesbian-best-love-popular-actress-four-sets-eight-4-hours-2396.html"

driver = webdriver.Chrome() # if you want to use chrome, replace Firefox() with Chrome()
driver.get(tst_url) # load the web page

WebDriverWait(driver, 50).until(EC.visibility_of_element_located((By.ID, "viewplayer"))) # waits till the element with the specific id appears
src = driver.page_source # gets the html source of the page

parser = BeautifulSoup(src,"lxml") # initialize the parser and parse the source "src"
video_attr = {"class" : "jw-video jw-reset"} # A list of attributes that you want to check in a tag
video_tag = parser.findAll('video',attrs=video_attr) # Get the video tag from the source
print parser.find_all('img')[1]['src']
wget.download(parser.find_all('img')[1]['src'])


n = 0 # Specify the index of video element in the web page
url = video_tag[n]['src'] # get the src attribute of the video
#wget.download(url, out="./video/tst_video") # download the video

driver.close() # closes the driver
display.stop()
