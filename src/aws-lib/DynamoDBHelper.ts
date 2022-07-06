import { DynamoDB } from 'aws-sdk'

export class DynamoDBHelper {
  private ddb: DynamoDB.DocumentClient
  private tableName: string = process.env.tblMessages

  constructor () {
    this.ddb = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })
  }

  public async saveMessage (data: { recipient: string, message: string }) {
    try {
      const params = {
        TableName: this.tableName,
        Item: {
          pk: `recipient#${data.recipient}`,
          sk: new Date().toISOString(),
          message: data.message
        }
      }
      await this.ddb.put(params).promise()
    } catch (err) {
      throw err
    }
  }

  public async getMessagesByRecipient (recipient: string) {
    try {

      const params = {
        TableName: this.tableName,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
          ':pk': `recipient#${recipient}`
        },
        ProjectionExpression: 'message, sk'
      }

      const data = await this.ddb.query(params).promise()

      return data?.Items ?
        data.Items.map(item => ({
          message: item.message,
          date: item.sk
        })) : []
    } catch (err) {
      throw err
    }
  }
}
