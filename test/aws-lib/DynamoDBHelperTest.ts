import { DynamoDB } from "aws-sdk"

import { expect } from "chai";
import sinon from 'sinon';
import { DynamoDBHelper } from "../../src/aws-lib/DynamoDBHelper";

describe("DynamoDBHelper", () => {
    let helper: DynamoDBHelper;

    before(() => {
        helper = new DynamoDBHelper();
    });

    describe("#saveMessage", () => {
        let stubDDBPut: sinon.SinonStub;

        beforeEach(() => {
            stubDDBPut = sinon.stub(DynamoDB.DocumentClient.prototype, 'put')
            stubDDBPut.returns({ promise: () =>  true } as unknown);
        });

        afterEach(() => {
            stubDDBPut.restore();
        });

        it("should save message successfully", async () => {
            const data = {
                recipient: "dummyRecipient",
                message: "dummyMessage"
            }

            try {
                await helper.saveMessage(data);
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it("should throw an error when DDB request failed", async () => {
            const data = {
                recipient: "dummyRecipient",
                message: "dummyMessage"
            }

            stubDDBPut.throws(new Error("DDB Error!"));

            try {
                await helper.saveMessage(data);
            } catch (err) {
                expect(err).to.not.be.undefined;
            }
        });
    });

    describe("#getMessagesByRecipient", () => {
        let stubDDBQuery: sinon.SinonStub;

        beforeEach(() => {
            stubDDBQuery = sinon.stub(DynamoDB.DocumentClient.prototype, 'query')
            stubDDBQuery.returns({
                promise: () => {
                    return { Count: 0, Items: [] };
                }
            } as unknown);
            
        });

        afterEach(() => {
            stubDDBQuery.restore();
        });

        it("should return an array of messages when recipient has messages in DDB", async () => {
            const recipient = "dummyRecipient";
            stubDDBQuery.returns({
                promise: () => {
                    return { Count: 1, Items: [{ message: "Hello!", sk: new Date().toISOString() }] };
                }
            } as unknown);

            try {
                const data = await helper.getMessagesByRecipient(recipient);
                expect(data).to.have.lengthOf(1);
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it("should return an empty array when recipient has no messages in DDB", async () => {
            const recipient = "dummyRecipient";

            try {
                const data = await helper.getMessagesByRecipient(recipient);
                expect(data).to.have.lengthOf(0);
            } catch (err) {
                expect(err).to.be.undefined;
            }
        });

        it("should throw an error when DDB request failed", async () => {
            const recipient = "dummyRecipient";

            stubDDBQuery.throws(new Error("DDB Error!"));

            try {
                const data = await helper.getMessagesByRecipient(recipient);
                expect(data).to.be.undefined;
            } catch (err) {
                expect(err).to.not.be.undefined;
            }
        });
    });
});
