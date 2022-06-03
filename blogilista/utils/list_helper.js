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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}