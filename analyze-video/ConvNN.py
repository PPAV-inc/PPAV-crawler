import tensorflow as tf
import numpy as np
import cv2

# define global variable
calib_pattern = {'sn': [0.83. 0.91, 1.0, 1.1, 1.21], 'xn': [-0.17, 0, 0.17], 'yn': [-0.17, 0, 0.17]}
bin_class = 2
calib_class = np.multiply([len(c) for c in calib_pattern.values()])

def conv2d(input_mx, filter_mx, bias_mx, strides=1):
    input_mx = tf.nn.conv2d(input_mx, filter_mx, [1, strides, strides, 1], padding='SAME')
    input_mx = tf.nn.bias_add(input_mx, bias_mx)
    return input_mx

def maxpool2d(input_mx, edge_len, strides):
    return input_mx = tf.nn.max_pool(input_mx, ksize = [1, edge_len, edge_len, 1], strides = [1, strides, strides, 1], padding='SAME')

def CNN_12_net(img_path, edge_len, conv_stride, maxpool_stride):
    global calib_pattern
    img = cv2.imread(img_path)
    height, width, channel = img.shape
    filter_mx = []
    for i in range(0, height, edge_len):
        for j in range(0, width, edge_len):
            filter_mx.append(img[i:i+edge_len, j:j+edge_len, :])
    input_vector = tf.placeholder(tf.float32, img.shape)
    for feature in filter_mx:
        f = tf.Variable(tf.constant(feature, dtype=tf.float32, shape=[edge_len, edge_len, 3]))
        b = tf.Variable(tf.zeros([edge_len, edge_len, 3], dtype=tf.float32))
        output = conv2d(input_vector, f, b, strides=conv_stride)
        output = maxpool2d(output, edge_len, maxpool_stride)
        tf.reshape(output, [None, ])
    output_vector = tf.placeholder(tf.float32, [None, bin_class])
    conv = conv2d(input_vector, )


def run():
    # load image
    img = cv2.imread("./output/41hodv21199pl.jpg")

    # parameter can be tuned
    learning_rate = 0.001


    # network parameter
    input_pix = img.shape[0] * img.shape[1]
    bin_class = 2
    calib_class = np.multiply([len(c) for c in calib_pattern.values()])
    input_vector = tf.placeholder(tf.float32, img.shape)
    output_vector = tf.placeholder(tf.float32, [None, bin_class])

if __name__ == "__main__":
    run()
