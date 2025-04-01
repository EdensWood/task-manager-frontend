import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Dashboard from '../../dashboard/page';
import { GET_MY_TASKS } from '../../graphql/queries';
import { LOGOUT_MUTATION } from '../../graphql/mutations'; // Update the path to the correct location
import { describe, it } from 'node:test';
import '@testing-library/jest-dom';

// Mock data
const mockTasks = [
  {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: 'PENDING'
  }
];

const mocks = [
  {
    request: {
      query: GET_MY_TASKS,
    },
    result: {
      data: {
        myTasks: mockTasks
      }
    }
  },
  {
    request: {
      query: LOGOUT_MUTATION,
    },
    result: {
      data: {
        logout: true
      }
    }
  }
];

describe('Dashboard Component', () => {
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );
    
    expect(screen.getByText('Loading tasks...')).toBeInTheDocument();
  });

  it('displays tasks after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });
  });

  it('shows task statistics', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument(); // Pending count
    });
  });

  it('toggles completed tasks visibility', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );
    
    await waitFor(() => {
      const toggleButton = screen.getByText(/Show Completed/i);
      fireEvent.click(toggleButton);
      expect(screen.getByText(/Hide Completed/i)).toBeInTheDocument();
    });
  });

  it('opens task form when clicked', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /New Task/i });
    fireEvent.click(addButton);
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('handles logout', async () => {
    const pushMock = jest.fn();
    jest.mock('next/navigation', () => ({
      useRouter: () => ({
        push: pushMock,
      }),
    }));
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <Dashboard />
      </MockedProvider>
    );
    
    await waitFor(() => {
      const logoutButton = screen.getByText(/Logout/i);
      fireEvent.click(logoutButton);
      expect(pushMock).toHaveBeenCalledWith('/login');
    });
  });
});

// Removed the custom expect function to avoid conflicts with the testing-library's expect.
