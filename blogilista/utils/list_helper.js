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

module.exports = {
  dummy,
  totalLikes
}