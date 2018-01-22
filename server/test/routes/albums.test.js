const sinon = require("sinon");
const {expect, should} = require("chai");
// const proxyquire = require("proxyquire");
// proxyquire("../../routes/albums", {
//     "../models/albums":{}
// });
let albums = require("../../routes/albums");

describe("Album Routes", function(){
    describe("get()", function(){
        it("fetches all the albums", function(){
            expect(true).to.equal(true);
        });
    });
});