const express = require('express')
const Blogs = require('../models/blog')

const blogsRouter = express.Router()

blogsRouter.get('/', (request, response) => {
    Blogs.find({})
        .then((blogs) => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blogs(request.body)

    blog.save()
        .then((result) => {
            response.status(201).json(result)
        })
})

module.exports = blogsRouter