const {stub, spy} = require("sinon");
const {expect} = require("chai");
const proxyquire = require("proxyquire");

describe("Test File Helper methods", ()=>{
    let statStub, fsStub, pathStub,utilStub, f_helper;
    beforeEach(()=>{
        statStub = {
            isDirectory: stub().returns(true)
        }
        fsStub = {
            stat: stub().resolves(statStub),
            mkdir: spy()
        };
        pathStub = {
            resolve: spy()
        };
        utilStub = {
            promisify: (type)=>{
                return type;
            }
        };  
        f_helper = proxyquire("../../helpers/file", {
            "path": pathStub,
            "util": utilStub,
            "fs": fsStub
        });
    })
    describe(".obtainDirectory()", ()=>{
        it("it resolves the path", async ()=>{
            await f_helper.obtainDirectory("fake/base/path", "actual/dir/path");
            expect(pathStub.resolve.called).to.equal(true);
            expect(fsStub.mkdir.called).to.equal(false);
        });
        it("it also checks whether directtory exists or not", async ()=>{
            pathStub.resolve = stub().returns("/resolve/path");
            await f_helper.obtainDirectory("fake/base/path", "actual/dir/path");
            expect(fsStub.stat.calledWith("/resolve/path")).to.equal(true);
            expect(fsStub.mkdir.called).to.equal(false);
        })
        it("it will create directory and then return the path back", async()=>{
            statStub.isDirectory = stub().returns(false);
            await f_helper.obtainDirectory("fake/base/path", "actual/dir/path");
            expect(pathStub.resolve.called).to.equal(true);
            expect(fsStub.mkdir.called).to.equal(true);
        });
    });
})