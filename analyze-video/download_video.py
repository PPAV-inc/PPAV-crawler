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

tst_url = "http://xonline.vip/watch-hbad-317-i-fucked-the-yoshikarada-natural-defenseless-instructor-yukari-maki-to-the-crotch-of-a-man-in-the-mind-1177.html"

driver = webdriver.Chrome() # if you want to use chrome, replace Firefox() with Chrome()
driver.get(tst_url) # load the web page

WebDriverWait(driver, 50).until(EC.visibility_of_element_located((By.ID, "viewplayer"))) # waits till the element with the specific id appears
src = driver.page_source # gets the html source of the page

parser = BeautifulSoup(src,"lxml") # initialize the parser and parse the source "src"
list_of_attributes = {"class" : "jw-video jw-reset"} # A list of attributes that you want to check in a tag
tag = parser.findAll('video',attrs=list_of_attributes) # Get the video tag from the source
print tag

n = 0 # Specify the index of video element in the web page
url = tag[n]['src'] # get the src attribute of the video
wget.download(url,out="./output_video") # download the video

driver.close() # closes the driver
display.stop()
