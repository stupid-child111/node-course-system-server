const amqp = require("amqplib");
const sendMail = require("./mail");
const logger = require("./logger");

// 创建全局的 RabbitMQ 连接和通道
let connection;
let channel;

/**
 * 连接到 RabbitMQ
 * @returns {Promise<*>}
 */
const connectToRabbitMQ = async () => {
  if (connection && channel) return; // 如果已经连接，直接返回

  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await connection.createChannel();
    await channel.assertQueue("mail_queue", { durable: true });
  } catch (error) {
    logger.error("RabbitMQ 连接失败：", error);
  }
};

/**
 * 邮件队列生产者（发送消息）
 */
const mailProducer = async (msg) => {
  try {
    await connectToRabbitMQ(); // 确保已连接

    channel.sendToQueue("mail_queue", Buffer.from(JSON.stringify(msg)), {
      persistent: true,
    });
  } catch (error) {
    logger.error("邮件队列生产者错误：", error);
  }
};

/**
 * 邮件队列消费者（接收消息）
 */
const mailConsumer = async () => {
  try {
    await connectToRabbitMQ();
    channel.consume(
      "mail_queue",
      async (msg) => {
        const message = JSON.parse(msg.content.toString());
        await sendMail(message.to, message.subject, message.html);
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    logger.error("邮件队列消费者错误：", error);
  }
};

module.exports = {
  mailProducer,
  mailConsumer,
};
