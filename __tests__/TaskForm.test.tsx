import { MockedProvider } from "@apollo/client/testing";

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom matchers
import TaskForm from '@/app/components/TaskForm'; // adjust the path as needed
import { CREATE_TASK_MUTATION, UPDATE_TASK_MUTATION } from '@/app/graphql/mutations';
import toast from "react-hot-toast";


// mockData.ts
// mockData.ts
const createTaskMock = {
    request: {
      query: CREATE_TASK_MUTATION,
      variables: {
        title: 'Test Task',
        description: 'This is a test task description.',
        status: 'PENDING',
      },
    },
    result: {
      data: {
        createTask: {
          id: '1',
          title: 'Test Task',
          description: 'This is a test task description.',
          status: 'PENDING',
        },
      },
    },
  };
  
  const updateTaskMock = {
    request: {
      query: UPDATE_TASK_MUTATION,
      variables: {
        id: '1',
        title: 'Updated Task',
        description: 'Updated task description',
        status: 'IN_PROGRESS',
      },
    },
    result: {
      data: {
        updateTask: {
          id: '1',
          title: 'Updated Task',
          description: 'Updated task description',
          status: 'IN_PROGRESS',
        },
      },
    },
  };
  
  const failureMock = {
    request: {
      query: CREATE_TASK_MUTATION,
      variables: {
        title: 'Test Task',
        description: 'This is a test task description.',
        status: 'PENDING',
      },
    },
    error: new Error('Error creating task'),
  };
  
  describe("TaskForm", () => {
    // Test: Renders TaskForm and submits data successfully
    test("renders TaskForm and submits data successfully", async () => {
      render(
        <MockedProvider mocks={[createTaskMock]} addTypename={false}>
          <TaskForm onClose={jest.fn()} />
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test Task" } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "This is a test task description." } });
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: "PENDING" } });
  
      fireEvent.click(screen.getByRole("button", { name: /create/i }));
  
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("🎉 Task created successfully!");
      });
    });
  
    // Test: Shows error message on mutation failure
    test("shows error message on mutation failure", async () => {
      render(
        <MockedProvider mocks={[failureMock]} addTypename={false}>
          <TaskForm onClose={jest.fn()} />
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Test Task" } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "This is a test task description." } });
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: "PENDING" } });
  
      fireEvent.click(screen.getByRole("button", { name: /create/i }));
  
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("❌ Error: Error creating task");
      });
    });
  
    // Test: Validation error for missing title
    test("shows validation error when title is missing", async () => {
      render(
        <MockedProvider mocks={[createTaskMock]} addTypename={false}>
          <TaskForm onClose={jest.fn()} />
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "This is a test task description." } });
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: "PENDING" } });
  
      fireEvent.click(screen.getByRole("button", { name: /create/i }));
  
      await waitFor(() => {
        expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      });
    });
  
    // Test: Validation error for short title
    test("shows validation error when title is too short", async () => {
      render(
        <MockedProvider mocks={[createTaskMock]} addTypename={false}>
          <TaskForm onClose={jest.fn()} />
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "A" } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "This is a test task description." } });
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: "PENDING" } });
  
      fireEvent.click(screen.getByRole("button", { name: /create/i }));
  
      await waitFor(() => {
        expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
      });
    });
  
    // Test: Renders TaskForm for editing and submits data
    test("renders TaskForm for editing and submits data", async () => {
      render(
        <MockedProvider mocks={[updateTaskMock]} addTypename={false}>
          <TaskForm task={{ id: "1", title: "Old Title", description: "Old description", status: "PENDING", user: { id: "123", name: "John Doe", email: "john.doe@example.com" } }} onClose={jest.fn()} />
        </MockedProvider>
      );
  
      fireEvent.change(screen.getByLabelText(/title/i), { target: { value: "Updated Task" } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: "Updated task description" } });
      fireEvent.change(screen.getByLabelText(/status/i), { target: { value: "IN_PROGRESS" } });
  
      fireEvent.click(screen.getByRole("button", { name: /update/i }));
  
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("✅ Task updated successfully!");
      });
    });
  
    // Test: Cancel button closes the form
    test("cancel button closes the form", () => {
      const onClose = jest.fn();
      render(
        <MockedProvider mocks={[]} addTypename={false}>
          <TaskForm onClose={onClose} />
        </MockedProvider>
      );
  
      fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
  
      expect(onClose).toHaveBeenCalled();
    });
  });
  