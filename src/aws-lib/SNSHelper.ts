import { SNS } from 'aws-sdk'
import { logger } from '../common/Logger'

export class SNSHelper {
  private _sns: SNS

  get sns (): SNS {
    return this._sns || new SNS({ apiVersion: '2012-08-10' })
  }

  set sns (sns: SNS) {
    this._sns = sns
  }

  public async sendSMS (recipient: string, message: string) {
    try {
      const params = {
        PhoneNumber: recipient,
        Message: message
      }

      const id = await this.sns.publish(params).promise()
      logger.info('Message sent', id)

      return id
    } catch (err) {
      throw err
    }
  }
}
