# download video from website 
> need to install a web browser, first try firefox, but there is some issue while trying to load website. So next try to install google-chrome
> google chrome: 
>> installing chrome browser
>> sudo apt-get install gdebi
>> download the installer from [google](https://www.google.com/chrome/browser/desktop/index.html) (ps: can't use wget need to use FTP upload)
>> change to the dir where the installer is. `$ sudo gdebi google-chrome-stable_current_amd64.deb`
> installing chrome driver [ref](https://developers.supportbee.com/blog/setting-up-cucumber-to-run-with-Chrome-on-Linux/)
>> use 2.24 version of chromedriver is more stable and can prevent some error
>> get the latest version of driver from [url](http://chromedriver.storage.googleapis.com/index.html) `$ wget http://chromedriver.storage.googleapis.com/2.9/chromedriver_linux64.zip` 
>> unzip it
>> cp chromedriver to /usr/bin/ `$ sudo mv ./chromedriver /usr/bin/`
>> change mode make it executable `$ sudo chmod a+x chromedriver`
> load video from dynamic load in content [ref](https://dvenkatsagar.github.io/tutorials/python/2015/10/26/ddlv/) 
> need to install lxml

# analyze video 
> try to use opencv python version
>> install opencv [ref](http://milq.github.io/install-opencv-ubuntu-debian/)
> use database here to train model 29(JAFFE), 20(Face Recognition Data, University of Essex), 23(FEI Face Database) [ref](https://www.kairos.com/blog/60-facial-recognition-databases)
>> NMS (non maximum supression)
>>> [paper](https://lirias.kuleuven.be/bitstream/123456789/506283/1/3924_postprint.pdf) for similar purpose 
>>> [implement](http://www.pyimagesearch.com/2014/11/17/non-maximum-suppression-object-detection-python) NMS in python to calculate overlap ratio
>> install PIL (Python Image Library) [ref](http://askubuntu.com/questions/507459/pil-install-in-ubuntu-14-04-1-lts)

