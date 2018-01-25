const {expect, should} = require("chai");
const sinon = require("sinon");
const {stub, spy} = sinon;
const proxyquire = require("proxyquire");

describe("route handler for /photo(s)/*", ()=>{
    let photoController;
    let fsStub = {
        rename: spy()
    };

    let utilStub = {
        promisify: ()=>{
            return fsStub.rename;
        }
    };
    
    let helperStub = {
        obtainDirectory: stub().resolves("fake/path/for/photos")
    };
    
    let PhotoStub = function Photo(obj){
        obj.save = spy();
        return obj;
    };

    before(()=>{
        photoController = proxyquire("../../handlers/photoHandler", {
            "util": utilStub,
            "fs": fsStub,
            "../helpers/file": helperStub,
            "../models/Photo": PhotoStub
        });
    });
    describe(".updalodImage()", ()=>{
        let ctx, next;
        beforeEach(()=>{
            ctx = {
                params:{
                    id:"album123"
                },            
                request:{
                    body:{
                        files:{
                            imageFile:{
                                name:"image.png",
                                path:"browser/location/of/image.png"
                            }
                        }
                    }
                }
            };
            next = spy();            
        });
        it("it return 500 and logs error if there is no file to upload", async ()=>{
            delete ctx.request.body;
            console.error = spy();
            await photoController.uploadImage(ctx, spy);
            expect(ctx.status).to.equal(500);
            expect(console.error.called).to.equal(true);
        });
        it("it uploads the image", async ()=>{
            await photoController.uploadImage(ctx, spy);
            expect(fsStub.rename.calledWith("browser/location/of/image.png", "fake/path/for/photos/image.png")).to.equal(true);
            expect(ctx.status).to.equal(201);
            expect(ctx.body.album_id).to.equal("album123");
            expect(ctx.body.location).to.be.equal("fake/path/for/photos/image.png");
            expect(ctx.body.name).to.be.equal("image.png");
            expect(ctx.body.save.called).to.equal(true);
        });
    });
});