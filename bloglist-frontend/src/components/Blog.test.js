import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from './Blog'

test('regularBlog renders only title and author', () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0
  }

  const user = {
    username: 'username',
    name: 'name',
    token: 'token'
  }

  render(<Blog blog={blog} user={user}/>)

  const element_1 = screen.getByText('title author')
  expect(element_1).toBeDefined()
  const element_2 = screen.queryByText('url')
  expect(element_2).toBeNull()
  const element_3 = screen.queryByText('likes')
  expect(element_3).toBeNull()
})