import { APIGatewayEvent, Handler } from 'aws-lambda'
import { Code, createResponse } from './common/HttpResponse'
import { DynamoDBHelper } from './aws-lib/DynamoDBHelper'
import { SNSHelper } from './aws-lib/SNSHelper'
import { logger } from './common/Logger'

export const sendMessage: Handler = async (event: APIGatewayEvent) => {
  const sns = new SNSHelper()
  const ddb = new DynamoDBHelper()

  try {
    const body = JSON.parse(event.body)

    await sns.sendSMS(body.recipient, body.message)
    await ddb.saveMessage(body)

    return createResponse(Code.SUCCESS)
  } catch (err) {
    logger.error(err.message)
    return createResponse(Code.SERVER_ERROR, JSON.stringify({ err }))
  }
}

export const getMessages: Handler = async (event: APIGatewayEvent) => {
  const ddb = new DynamoDBHelper()

  try {
    const params = event.queryStringParameters
    const recipient = params?.recipient

    const messages = await ddb.getMessagesByRecipient(recipient)

    return createResponse(Code.SUCCESS,
            JSON.stringify({
              recipient, messages
            }))
  } catch (err) {
    logger.error(err.message)
    return createResponse(Code.SERVER_ERROR, JSON.stringify({ err }))
  }
}
