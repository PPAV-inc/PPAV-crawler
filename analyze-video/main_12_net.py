import tensorflow as tf
import numpy as np
import cv2

def conv2d(input_mx, filter_mx, bias_mx, activation="relu", strides=1):
    input_mx = tf.nn.conv2d(input_mx, filter_mx, [1, strides, strides, 1], padding='SAME')
    input_mx = tf.nn.bias_add(input_mx, bias_mx)
    if activation is "relu":
        return tf.nn.relu(input_mx)
    elif activation is "sigmoid":
        return tf.sigmoid(input_mx)
    elif activation is "tanh":
        return tf.tanh(input_mx)

def maxpool2d(input_mx, edge_len, strides):
    return tf.nn.max_pool(input_mx, ksize = [1, edge_len, edge_len, 1], strides = [1, strides, strides, 1], padding='VALID')

def full_connected(input_mx, weight, bias, dropout = 0):
    input_mx = tf.add(tf.matmul(input_mx, weight), bias)
    if dropout > 0:
        return tf.nn.dropout(input_mx, dropout)
    return input_mx

def main_cnn_12_net(input_mx, weights, biases, dropout):
    # input matriinput_mx have size 12input_mx12
    with tf.name_scope("12_net"):
        input_mx = tf.reshape(input_mx, shape=[-1, 12, 12, 3])
        input_mx = conv2d(input_mx, weights["w1"], biases["b1"])
        print input_mx
        input_mx = maxpool2d(input_mx, 3, 1)
        print input_mx
        input_mx = tf.reshape(input_mx, [-1, 1600]) # modify to dynamic in future
        input_mx = full_connected(input_mx, weights['w2'], biases['b2'], dropout = dropout[0])
        input_mx = full_connected(input_mx, weights['w3'], biases['b3'], dropout = dropout[1])
        return input_mx

def training(training_sample, label):
    sess = tf.InteractiveSession()
    # 12_net env variable
    n_class = 2
    # parameter can be tuned
    learning_rate = 0.001
    dropout = [0.6, 0.4]
    n_batch = 1
    training_iter = 20

    # construct model
    x = tf.placeholder(tf.float32, [None, 3, 12, 12])
    y = tf.placeholder(tf.float32, [None, n_class])
    weights = {
        'w1' : tf.Variable(tf.random_normal([3, 3, 3, 16], name="12-net-conv-weight")), # 16 3x3 filter 
        'w2' : tf.Variable(tf.random_normal([1600, 16])),
        'w3' : tf.Variable(tf.random_normal([16, n_class]))
    }
    biases = {
        'b1' : tf.Variable(tf.random_normal([16])),
        'b2' : tf.Variable(tf.random_normal([16])),
        'b3' : tf.Variable(tf.random_normal([n_class]))
    }
    if len(training_sample) % n_batch is not 0:
        raise ValueError("training_sample size must be divisible to n_batch")
    batch_size = len(training_sample) / n_batch 
    predict = main_cnn_12_net(x, weights, biases, dropout)
    print predict
    cost = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(predict, y)) 
    optimizer = tf.train.AdamOptimizer(learning_rate=learning_rate).minimize(cost)
    correct = tf.equal(tf.argmax(predict, 1), tf.argmax(y, 1))
    accuracy = tf.reduce_mean(tf.cast(correct, tf.float32))
    init = tf.initialize_all_variables()

    #with tf.InteractiveSession() as sess:
    sess.run(init)
    step  = 0
    while step * batch_size < training_iter:
        i = step % n_batch
        start = i * n_batch
        sess.run(optimizer, feed_dict = {x: training_sample[start : start+batch_size], y: label[start : start+batch_size]})
        loss, acc = sess.run([correct, accuracy], feed_dict = {x: training_sample[start : start+n_batch], y: label[start : start+n_batch]})
        print "Iter %d, Minibatch Loss=%f, Training Accuracy=%f"%(step*batch_size, loss, acc)

    step += 1
    print ("Training Complete")

def testing():
    training_sample = np.random.rand(50, 3, 12, 12)
    training_sample *= 255
    label = np.random.randint(2, size=(50, 2))
    img = np.array(cv2.imread('./tst.image'))
    resize_img = None
    cv2.resize(img, resize_img, (12, 12), cv2.INTER_CUBIC)
    #training(training_sample, label)


if __name__ == "__main__":
    testing()
