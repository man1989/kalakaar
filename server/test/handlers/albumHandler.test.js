const {expect} = require("chai");
const {spy, stub} = require("sinon");
const proxyquire = require("proxyquire");
describe("handler for all album routes", ()=>{
    let AlbumStub = stub();
    AlbumStub.find = stub();
    AlbumStub.findById = spy();
    AlbumStub.prototype.update = spy();
    AlbumStub.prototype.save = spy();

    let albumHandler = proxyquire("../../handlers/albumHandler", {
        "../models/Album": AlbumStub
    });

    describe(".listAlbums()", ()=>{
        let ctx, next;
        beforeEach(()=>{
            ctx={};
            next=spy();
        })
        it("list all the albums", async()=>{
            AlbumStub.find.returns(["1", "2"]);
            await albumHandler.listAll(ctx, next);
            expect(ctx.status).to.equal(200);
        });
        it("it will respond with 404, if no album found", async()=>{
            AlbumStub.find.returns([]);
            await albumHandler.listAll(ctx, next);
            expect(ctx.status).to.equal(404);
        });
    });
    describe.skip(".fetchAlbumById()", ()=>{
    });
    describe.skip(".fetchAlbumByName()", ()=>{});
    describe.skip(".updateAlbum()", ()=>{});
    describe.skip(".createAlbum()", ()=>{});
})