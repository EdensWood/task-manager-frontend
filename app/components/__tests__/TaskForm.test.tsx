// components/__tests__/TaskForm.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import TaskForm from '../TaskForm';
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION } from '../../graphql/mutations';
import { describe, it } from 'node:test';

// Mock data
const mockTask = {
  id: '1',
  title: 'Existing Task',
  description: 'Existing Description',
  status: 'PENDING'
};

const mocks = [
  {
    request: {
      query: CREATE_TASK_MUTATION,
      variables: {
        title: 'New Task',
        description: 'Test Description',
        status: 'PENDING'
      }
    },
    result: {
      data: {
        createTask: {
          id: '2',
          title: 'New Task',
          description: 'Test Description',
          status: 'PENDING'
        }
      }
    }
  },
  {
    request: {
      query: UPDATE_TASK_MUTATION,
      variables: {
        id: '1',
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'IN_PROGRESS'
      }
    },
    result: {
      data: {
        updateTask: {
          id: '1',
          title: 'Updated Task',
          description: 'Updated Description',
          status: 'IN_PROGRESS'
        }
      }
    }
  }
];

describe('TaskForm Component', () => {
  it('renders create form with empty fields', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskForm onClose={() => {}} onSuccess={() => {}} />
      </MockedProvider>
    );

    expect(screen.getByLabelText('Title *')).toHaveValue('');
    expect(screen.getByLabelText('Description *')).toHaveValue('');
    expect(screen.getByText('Create New Task')).toBeInTheDocument();
  });

  it('renders edit form with task data', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskForm task={mockTask} onClose={() => {}} onSuccess={() => {}} />
      </MockedProvider>
    );

    expect(screen.getByLabelText('Title *')).toHaveValue('Existing Task');
    expect(screen.getByLabelText('Description *')).toHaveValue('Existing Description');
    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskForm onClose={() => {}} onSuccess={() => {}} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Create Task'));
    
    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });
  });

  it('submits new task form', async () => {
    const onSuccessMock = jest.fn();
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskForm onClose={() => {}} onSuccess={onSuccessMock} />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'New Task' }
    });
    fireEvent.change(screen.getByLabelText('Description *'), {
      target: { value: 'Test Description' }
    });
    fireEvent.click(screen.getByText('Create Task'));

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('submits updated task', async () => {
    const onSuccessMock = jest.fn();
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskForm task={mockTask} onClose={() => {}} onSuccess={onSuccessMock} />
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText('Title *'), {
      target: { value: 'Updated Task' }
    });
    fireEvent.change(screen.getByLabelText('Description *'), {
      target: { value: 'Updated Description' }
    });
    fireEvent.change(screen.getByLabelText('Status'), {
      target: { value: 'IN_PROGRESS' }
    });
    fireEvent.click(screen.getByText('Update Task'));

    await waitFor(() => {
      expect(onSuccessMock).toHaveBeenCalled();
    });
  });

  it('closes when cancel is clicked', () => {
    const onCloseMock = jest.fn();
    
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <TaskForm onClose={onCloseMock} onSuccess={() => {}} />
      </MockedProvider>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalled();
  });
});

// Removed the custom expect function to avoid conflicts with the testing library's expect.
