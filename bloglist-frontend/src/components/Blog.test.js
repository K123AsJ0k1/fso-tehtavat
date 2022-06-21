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

  let viewable = false

  const mockHandler = jest.fn(() => {
    viewable = true
  })

  render(<Blog blog={blog} user={user} viewable={viewable} toggleViewable={mockHandler}/>)

  const user_Session = userEvent.setup()

  const button = screen.getByText('view')
  await user_Session.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1)

  const element_1 = screen.queryByText('title author')
  expect(element_1).toBeDefined()
  const element_2 = screen.queryByText('url')
  expect(element_2).toBeDefined()
  const element_3 = screen.queryByText('likes')
  expect(element_3).toBeDefined()
})

test('The event handler of the like button is called twice', async () => {
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

  let viewable = true

  const mockHandler = jest.fn()

  render(<Blog blog={blog} user={user} viewable={viewable} updateBlog={mockHandler}/>)

  const user_Session = userEvent.setup()
  const like_button = screen.getByText('like')
  await user_Session.click(like_button)
  await user_Session.click(like_button)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
