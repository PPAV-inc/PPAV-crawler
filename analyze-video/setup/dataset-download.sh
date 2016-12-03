cd ../
mkdir dataset
cd dataset
mkdir FEI-Face-Database
wget http://cswww.essex.ac.uk/mv/allfaces/faces94.zip http://cswww.essex.ac.uk/mv/allfaces/faces95.zip http://cswww.essex.ac.uk/mv/allfaces/faces96.zip http://cswww.essex.ac.uk/mv/allfaces/grimace.zip -P FEI-Face-Database/ 
mkdir Face-Recognition-Data
wget http://fei.edu.br/~cet/originalimages_part1.zip http://fei.edu.br/~cet/originalimages_part2.zip http://fei.edu.br/~cet/originalimages_part3.zip http://fei.edu.br/~cet/originalimages_part4.zip -P Face-Recognition-Data/
mkdir Face-Recognition-Data/frontalimage
wget http://fei.edu.br/~cet/frontalimages_manuallyaligned_part1.zip http://fei.edu.br/~cet/frontalimages_manuallyaligned_part2.zip -P Face-Recognition-Data/frontalimage
mkdir JAFFE
wget http://www.kasrl.org/jaffeimages.zip -P JAFFE/
mkdir lfw
wget http://vis-www.cs.umass.edu/lfw/lfw.tgz -P lfw/
wget http://vis-www.cs.umass.edu/lfw/lfw-deepfunneled.tgz -P lfw/
unzip */*.zip
tar zxvf */*.tgz

