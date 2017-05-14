### muduo 网络库笔记

#### 简短话说明
muduo是一个one loop per thread 的reactor网络库，高性能是由非阻塞IO+线程池做支撑的，当然还有很多细节上做了优化。

服务端:

类TcpSever包含一个Acceptor的主EventLoop，用来监听接收新的连接，还包括多个用于处理IO的EventLoop,在ThreadPool中。
EventLoop包含一个Poller，Poller用来做IO多路复用，多个TcpConnection，TcpConnection是对Channel的封装，Channel用来持有fd,做读写事件控制。

客户端：

类TcpClient包含一个Connector, 多个TcpConnection，Connector对Channel进行封装，用来与服务端建立连接, 连接建立完成，保存为TcpConnection。

#### 细节上的优化

1. 非阻塞socket，用Buffer作为输入输出缓冲区，如果没有读到一个完整的message，先放入buffer中，待读完整一个message才交给业务逻辑处理。
写数据的时候，如果一次性写没有写完(write), 则将剩下的数据先放入buffer中，注册一个写事件（通过Channel的enableWriting）

2. RVO编译选项

3. 所有与IO相关的操作均放在IO线程中(EventLoop中), 这样可以避免多线程的竞争，避免了加锁。

