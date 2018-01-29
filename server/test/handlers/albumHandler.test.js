const {expect} = require("chai");
const {spy, stub} = require("sinon");
const proxyquire = require("proxyquire");
describe("handler for all album routes", ()=>{
    let saveStub = spy();
    let AlbumStub = function () {
    }
    AlbumStub.prototype.save = spy();
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
            AlbumStub.find.resolves(["1", "2"]);
            await albumHandler.listAll(ctx, next);
            expect(ctx.status).to.equal(200);
            expect(ctx.body.length).to.equal(2);
            expect(ctx.body[0]).to.equal("1");
            expect(ctx.body[1]).to.equal("2");
        });
        it("it will respond with 404, if no album found", async()=>{
            AlbumStub.find.resolves([]);
            await albumHandler.listAll(ctx, next);
            expect(ctx.status).to.equal(404);
            expect(ctx.body.length).to.equal(0);
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
            AlbumStub.findById.resolves({
                id:"123",
                name:"test"
            });
            await albumHandler.fetchAlbumById(ctx, next);
            expect(ctx.status).to.equal(200);
            expect(ctx.body.id).to.equal("123");
            expect(ctx.body.name).to.equal("test");
        });
        it("it will respond with 404, if no album found", async()=>{
            AlbumStub.findById.resolves(null);
            await albumHandler.fetchAlbumById(ctx, next);
            expect(ctx.status).to.equal(404);
            expect(ctx.body).to.deep.equal({});
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
            AlbumStub.findOne.resolves({
                id:"123",
                name:"test"
            });
            await albumHandler.fetchAlbumByName(ctx, next);
            expect(ctx.status).to.equal(200);
        });
        it("it will respond with 404, if no album found", async()=>{
            AlbumStub.findOne.resolves(null);
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
        it("will return status 201 on creation of album", async()=>{
            await albumHandler.createAlbum(ctx, next);
            expect(AlbumStub.prototype.save.called).to.equal(true);
            expect(ctx.status).to.equal(201);
        });
        it("in case of error it will return 500 as status code", async ()=>{
            AlbumStub.prototype.save = stub().rejects()
            await albumHandler.createAlbum(ctx, next);
            expect(ctx.status).to.equal(500);  
        });
    });
})