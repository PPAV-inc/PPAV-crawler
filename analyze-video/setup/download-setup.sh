sudo pip install selenium
sudo pip install beautifulsoup4
sudo pip install wget
sudo apt-get install xvfb
sudo pip install pyvirtualdisplay
sudo pip install lxml
sudo apt-get unzip

# install chrome browser & driver
sudo apt-get install gdebi
sudo gdebi ./setup/google-chrome-stable_current_amd64.deb
wget http://chromedriver.storage.googleapis.com/2.24/chromedriver_linux64.zip 
unzip chromedriver_linux64.zip
sudo mv chromedriver /usr/bin/
sudo chmod a+x chromedriver
