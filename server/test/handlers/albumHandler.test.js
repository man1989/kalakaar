const {expect} = require("chai");
const {spy, stub} = require("sinon");
const proxyquire = require("proxyquire");
describe("handler for all album routes", ()=>{
    let AlbumStub = stub();
    AlbumStub.find = stub();
    AlbumStub.findById = stub();
    AlbumStub.findOne = stub();

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
    describe(".fetchAlbumById()", ()=>{
        let ctx, next;
        beforeEach(()=>{
            ctx={
                params:{
                    id:"123"
                }
            };
            next=spy();
        })
        it("fetch the album by its Id", async()=>{
            AlbumStub.findById.returns({
                id:"123",
                name:"test"
            });
            await albumHandler.fetchAlbumById(ctx, next);
            expect(ctx.status).to.equal(200);
        });
        it("it will respond with 404, if no album found", async()=>{
            AlbumStub.findById.returns(null);
            await albumHandler.fetchAlbumById(ctx, next);
            expect(ctx.status).to.equal(404);
        });        
    });
    describe(".fetchAlbumByName()", ()=>{
        let ctx, next;
        beforeEach(()=>{
            ctx={
                params:{
                    name:"test"
                }
            };
            next=spy();
        });
        it("fetch the album by its name", async()=>{
            AlbumStub.findOne.returns({
                id:"123",
                name:"test"
            });
            await albumHandler.fetchAlbumByName(ctx, next);
            expect(ctx.status).to.equal(200);
        });
        it("it will respond with 404, if no album found", async()=>{
            AlbumStub.findOne.returns(null);
            await albumHandler.fetchAlbumByName(ctx, next);
            expect(ctx.status).to.equal(404);
        });             
    });
    describe(".updateAlbum()", ()=>{
        let ctx, next, album;
        beforeEach(()=>{
            ctx={
                params:{
                    id:"album123"
                },
                request:{
                    body:{
                        name:"anotherDummy"
                    }
                }
            };
            album = {
                id: "album123",
                name: "dummmy",
                update: spy()
            };
            next=spy();
        });

        it("updates the album", async ()=>{
            AlbumStub.findById.resolves(album);
            await albumHandler.updateAlbum(ctx, next);
            expect(ctx.status).to.equal(204);
            expect(album.name).to.equal("anotherDummy");
            expect(album.update.called).to.equal(true);
        });
        it("will return 404 in case of error", async ()=>{
            album.update = stub().throws();
            AlbumStub.findById.resolves(album);
            await albumHandler.updateAlbum(ctx, next);
            expect(ctx.status).to.equal(404);
            expect(album.update.called).to.equal(true);            
        });
    });
    describe(".createAlbum()", ()=>{
        let ctx, next, album;
        beforeEach(()=>{
            ctx={
                params:{
                    id:"album123"
                },
                request:{
                }
            };

            ctx.request.body = {
                id: "album123",
                name: "dummmy",
                save: spy()
            };
            next=spy();
        });        
        it("will return status 200 on creation of album", async()=>{
            AlbumStub.callsFake(obj=>obj);
            await albumHandler.createAlbum(ctx, next);
            expect(ctx.request.body.save.called).to.equal(true);
            expect(ctx.status).to.equal(201);
        });
        it("in case of error it will return 500 as status code", async ()=>{
            ctx.request.body.save = stub().throws();
            AlbumStub.callsFake(obj=>obj);
            await albumHandler.createAlbum(ctx, next);
            expect(ctx.status).to.equal(500);  
        });
    });
})