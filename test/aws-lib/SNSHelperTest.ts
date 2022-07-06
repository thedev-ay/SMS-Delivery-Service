import { SNS } from "aws-sdk"

import { expect } from "chai";
import sinon from 'sinon';
import { SNSHelper } from "../../src/aws-lib/SNSHelper";

describe("SNSHelper", () => {
    let helper: SNSHelper;

    before(() => {
        helper = new SNSHelper();
    });

    describe("#sendSMS", () => {
        let stubSNSPublish: sinon.SinonStub;

        beforeEach(() => {
            const sns = new SNS({ apiVersion: '2012-08-10' });
            stubSNSPublish = sinon.stub(sns, "publish")
            stubSNSPublish.returns({ promise: () => true });
            
            helper.sns = sns;
        });

        afterEach(() => {
            stubSNSPublish.restore();
        });

        it("should publish message successfully", async () => {
            const data = {
                recipient: "dummyRecipient",
                message: "dummyMessage"
            }

            try {
                const id = await helper.sendSMS(data.recipient, data.message);
                expect(id).to.not.be.undefined;
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it("should throw an error when SNS request failed", async () => {
            const data = {
                recipient: "dummyRecipient",
                message: "dummyMessage"
            }

            stubSNSPublish.throws(new Error("SNS Error!"));

            try {
                await helper.sendSMS(data.recipient, data.message);
            } catch (err) {
                expect(err).to.not.be.undefined;
            }
        });
    });
});