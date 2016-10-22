# download video from website 
* need to install a web browser, first try firefox, but there is some issue while trying to load website. So next try to install google-chrome
 - google chrome: 
  + installing chrome browser
   1. sudo apt-get install gdebi
   2. download the installer from google https://www.google.com/chrome/browser/desktop/index.html (ps: can't use wget need to use FTP upload)
   3. change to the dir where the installer is. `$ sudo gdebi google-chrome-stable_current_amd64.deb`
  + installing chrome driver ref: https://developers.supportbee.com/blog/setting-up-cucumber-to-run-with-Chrome-on-Linux/
   4. use 2.24 version of chromedriver is more stable and can prevent some error
   5. get the latest version of driver from url http://chromedriver.storage.googleapis.com/index.html `$ wget http://chromedriver.storage.googleapis.com/2.9/chromedriver_linux64.zip` 
   5. unzip it
   6. cp chromedriver to /usr/bin/ `$ sudo mv ./chromedriver /usr/bin/`
   7. change mode make it executable `$ sudo chmod a+x chromedriver`
 - firefox:
  1. `$ sudo apt-get install firefox`
* load video from dynamic load in content https://dvenkatsagar.github.io/tutorials/python/2015/10/26/ddlv/ 
* to solve firefox can't open without GUI issue http://stackoverflow.com/questions/26070834/how-to-fix-selenium-webdriverexception-the-browser-appears-to-have-exited-befor
* to solve the "WebDriverException: Message: 'geckodriver' executable needs to be in PATH." http://stackoverflow.com/questions/37761668/cant-open-browser-with-selenium-after-firefox-update/37765661
* need to install lxml
