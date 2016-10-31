import subprocess as sp
import numpy as np
FFMPEG_BIN = "ffmpeg" # on Linux ans Mac OS
command = [ FFMPEG_BIN,
        '-ss', '00:59:00',
        '-i', './video/tst_video',
        '-f', 'image2pipe',
        '-pix_fmt', 'rgb24',
        '-vcodec', 'rawvideo', '-']
pipe = sp.Popen(command, stdout = sp.PIPE, bufsize=10**8)
# read 420*360*3 bytes (= 1 frame)
raw_image = pipe.stdout.read(420*360*3)
# transform the byte read into a numpy array
image =  np.fromstring(raw_image, dtype='uint8')
image = image.reshape((360,420,3))
# throw away the data in the pipe's buffer.
pipe.stdout.flush()
print np.count_nonzero(image)
