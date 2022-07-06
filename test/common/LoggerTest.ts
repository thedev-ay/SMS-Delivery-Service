import { expect } from "chai";

import { logger } from "../../src/common/Logger";

describe("Logger", () => {    
    it("should create a logger instance", () => {
        expect(logger).to.not.be.undefined;
    })
})

