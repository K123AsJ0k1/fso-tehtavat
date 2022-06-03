// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

// eslint-disable-next-line no-unused-vars
const totalLikes = (blogs) => {
  let sum = 0
  let numbers = false

  Object.keys(blogs).forEach(key => {
    if (key === 'likes') {
      sum = blogs[key]
    }
    if (key === '0') {
      numbers = true
    }
    if (numbers) {
      sum = sum + blogs[key].likes
    }
  })

  return sum
}

// eslint-disable-next-line no-unused-vars
const favoriteBlog = (blogs) => {
  let favorite = null
  let multiple = false
  let most_likes = 0
  Object.keys(blogs).forEach(key => {
    if (key === 'likes') {
      favorite = {
        title: blogs.title,
        author: blogs.author,
        likes: blogs.likes
      }
    }
    if (key === '0') {
      multiple = true
    }
    if (multiple) {
      if (blogs[key].likes > most_likes) {
        most_likes = blogs[key].likes
        favorite = {
          title: blogs[key].title,
          author: blogs[key].author,
          likes: blogs[key].likes
        }
      }
    }
  })
  return favorite
}

// eslint-disable-next-line no-unused-vars
const mostBlogs = (blogs) => {
  let most_blogs = {
    author: '',
    blogs: 0
  }
  let multiple = false
  Object.keys(blogs).forEach(key => {
    if (key === 'author') {
      most_blogs.author = blogs.author
      most_blogs.blogs = 1
    }
    if (key === '0') {
      multiple = true
    }
    if (multiple) {
      const check_blogs = blogs
      let blog_author = blogs[key].author
      let blog_sum = 0

      Object.keys(check_blogs).forEach(check_key => {
        if (blog_author === check_blogs[check_key].author) {
          blog_sum = blog_sum + 1
        }
      })

      if (most_blogs.blogs < blog_sum) {
        most_blogs.author = blog_author
        most_blogs.blogs = blog_sum
      }
    }
  })
  return most_blogs
}

// eslint-disable-next-line no-unused-vars
const mostLikes = (blogs) => {
  let most_likes = {
    author: '',
    likes: 0
  }
  let multiple = false
  Object.keys(blogs).forEach(key => {
    if (key === 'likes') {
      most_likes.author = blogs.author
      most_likes.likes = blogs.likes
    }
    if (key === '0') {
      multiple = true
    }
    if (multiple) {
      const check_blogs = blogs
      let like_author = blogs[key].author
      let like_sum = 0
      Object.keys(check_blogs).forEach(check_key => {
        if (like_author === check_blogs[check_key].author) {
          like_sum = like_sum + check_blogs[check_key].likes
        }
      })
      if (most_likes.likes < like_sum) {
        most_likes.author = like_author
        most_likes.likes = like_sum
      }
    }
  })
  return most_likes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}