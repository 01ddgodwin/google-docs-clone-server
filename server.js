const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect("mongodb+srv://dillon:QjGb1439Zjo3riSU@cluster0.oapmx0i.mongodb.net/?retryWrites=true&w=majority")

const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "https://dillongodwin-google-docs-clone.netlify.app",
    methods: ["GET", "POST"],
  },
});

// QjGb1439Zjo3riSU

const defaultValue = ""

io.on("connection", (socket) => {
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);

    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentId, { data })
    }) 
  });
  console.log("connected");
});

async function findOrCreateDocument(id) {
    if (id == null) return
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue })
}
