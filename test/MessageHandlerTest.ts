import 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import { getMessages, sendMessage } from '../src/MessageHandler';
import { SNSHelper } from '../src/aws-lib/SNSHelper';
import { DynamoDBHelper } from '../src/aws-lib/DynamoDBHelper';

describe("MessageHandler", () => {
    describe("#sendMessage", () => {
        let mockSNS: sinon.SinonMock;
        let mockSNSSendSMS: sinon.SinonExpectation;
        let mockDDB: sinon.SinonMock;
        let mockDDBSaveMessage: sinon.SinonExpectation;

        beforeEach(() => {
            mockDDB = sinon.mock(DynamoDBHelper.prototype);
            mockDDBSaveMessage = mockDDB.expects("saveMessage");
            mockDDBSaveMessage.returns(true);

            mockSNS = sinon.mock(SNSHelper.prototype);
            mockSNSSendSMS = mockSNS.expects("sendSMS");
        });

        afterEach(() => {
            sinon.restore();
        });

        it("should return status code 200 when processing is successful", async () => {
            const event = {
                body: JSON.stringify({ recipient: "123", message: "Hello!" })
            }

            mockSNSSendSMS.returns(true);

            try {
                const response = await sendMessage(event, undefined, undefined);
                expect(response.statusCode).to.be.eq(200);
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it("should return status code 500 when processing failed", async () => {
            const event = {
                body: JSON.stringify({ recipient: "123", message: "Hello!" })
            }

            mockSNSSendSMS.throws(new Error("SNS Error!"));

            try {
                const response = await sendMessage(event, undefined, undefined);
                expect(response.statusCode).to.be.eq(500);
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });
    })

    describe("#getMessages", () => {
        let mockDDB: sinon.SinonMock;
        let mockDDBGetMessagesByRecipient: sinon.SinonExpectation;

        beforeEach(() => {
            mockDDB = sinon.mock(DynamoDBHelper.prototype);
            mockDDBGetMessagesByRecipient = mockDDB.expects("getMessagesByRecipient");
        });

        afterEach(() => {
            mockDDB.restore();
        });

        it("should return status code 200 when processing is successful", async () => {
            const event = {
                queryStringParameters: {
                    recipient: "123"
                }
            }

            mockDDBGetMessagesByRecipient.returns(true);

            try {
                const response = await getMessages(event, undefined, undefined);
                expect(response.statusCode).to.be.eq(200);
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it("should return status code 500 when processing failed", async () => {
            const event = {
                queryStringParameters: {
                    recipient: "123"
                }
            }

            mockDDBGetMessagesByRecipient.throws(new Error("DDB Error!"));

            try {
                const response = await getMessages(event, undefined, undefined);
                expect(response.statusCode).to.be.eq(500);
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });
    })
})