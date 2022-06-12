import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('viewedBlog renders title, author, url and likes', async () => {
  const user = {
    username: 'username',
    name: 'name',
    token: 'token'
  }

  const blog = {
    title: 'title',
    author: 'author',
    url: 'url',
    likes: 0,
    user: user
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={user} toggleViewable={mockHandler}/>)

  const user_Session = userEvent.setup()
  const button = screen.getByText('view')
  await user_Session.click(button)

  const element_1 = screen.queryByText('title author')
  expect(element_1).toBeDefined()
  const element_2 = screen.queryByText('url')
  expect(element_2).toBeDefined()
  const element_3 = screen.queryByText('likes')
  expect(element_3).toBeDefined()
})