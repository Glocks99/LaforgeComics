const express = require("express")
const cors = require("cors")
require("dotenv").config()
const cookieParser =require("cookie-parser")
const connectDB = require("./config/db.js")
const userRoute = require("./routes/user.js")
const blogRoute = require("./routes/blogs.js")
const comicRoute = require("./routes/comic.js")
const carouselRoute = require("./routes/carousel.js")
const artistRoute = require("./routes/artist.js")
const genreRoute = require("./routes/genres.js")
const worksRoute = require("./routes/works.js")
const ratingRoute = require("./routes/ratings.js")
const booksRoute = require("./routes/books.js")
const likeRoutes = require("./routes/likes.js")
const commentRoutes = require("./routes/comments.js")
const episodeRoutes = require("./routes/episode.js")
const viewRoutes = require("./routes/views.js")

connectDB();
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET","DELETE","POST","PUT","PATCH"],
    allowedHeaders: "content-Type, Authorization",
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(express.static('public'))


app.use("/api/user", userRoute)
app.use("/api/blogs", blogRoute)
app.use("/api/comics", comicRoute)
app.use("/api/carousel", carouselRoute)
app.use("/api/artist", artistRoute)
app.use("/api/genres", genreRoute)
app.use("/api/works", worksRoute)
app.use("/api/ratings", ratingRoute)
app.use("/api/books", booksRoute)
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/episodes", episodeRoutes)
app.use("/api/views", viewRoutes)


app.get("/", (req,res) => {
    res.send("server is running fine!")
})


app.listen(3000, () => {
    console.log(`server is running on port: ${process.env.PORT}`)
})