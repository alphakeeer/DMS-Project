import { createBrowserRouter } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/Home'
import CreateEventPage from '@/pages/CreateEvent'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'create-event', element: (
        <PrivateRoute roles={['admin']}>
          <CreateEventPage />
        </PrivateRoute>
      )},
      { path: 'events/:id', element: <EventDetailPage /> }
    ]
  }
])
