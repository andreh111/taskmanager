import { useEffect, useState, useCallback } from "react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useDisclosure,
  useToast,
  Select,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import Router from "next/router";
import { getUserId } from "../helpers";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low"); // Default priority
  const toast = useToast();

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
      Router.push("/"); // redirect to login if no refresh token
      return null;
    }

    try {
      const response = await fetch("http://0.0.0.0:8000/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      localStorage.setItem("token", data.access); // Update the access token
      return data.access;
    } catch (error) {
      console.error("Error refreshing token:", error);
      Router.push("/"); // redirect to login if refresh fails
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let token = localStorage.getItem("token");

    const postData = async () => {
      const response = await fetch("http://0.0.0.0:8000/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          created_by: getUserId(token),
          priority,
        }),
      });

      return response;
    };

    let response = await postData();

    if (response.status === 401) {
      // If token is expired
      token = await refreshAccessToken();
      if (!token) return;

      response = await postData(); // Retry with new token
    }

    if (response.ok) {
      // Reset form and close modal
      setTitle("");
      setDescription("");
      onClose();

      // Optional: Show success message
      toast({
        title: "Task added",
        description: "Your new task was successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchTasks();

      // Optional: Refresh tasks or update state to show the new task
    } else {
      // Handle other errors
      console.error("Error adding task:", response.statusText);
    }
  };

  const fetchTasks = useCallback(async () => {
    let token = localStorage.getItem("token");

    let response = await fetch("http://0.0.0.0:8000/tasks/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      // If token is expired
      token = await refreshAccessToken();
      if (!token) return;

      response = await fetch("http://0.0.0.0:8000/tasks/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    if (response.ok) {
      const data = await response.json();
      setTasks(data);
    } else {
      // Handle errors other than token expiration here
    }
  }, []);

  const deleteTask = async (taskId) => {
    let token = localStorage.getItem("token");

    const deleteData = async () => {
      const response = await fetch(`http://0.0.0.0:8000/tasks/${taskId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      return response;
    };

    let response = await deleteData();

    if (response.status === 401) {
      token = await refreshAccessToken();
      if (!token) return;

      response = await deleteData(); // Retry with new token
    }

    if (response.ok) {
      fetchTasks(); // Refresh the task list after deletion
    } else {
      console.error("Error deleting task:", response.statusText);
      // Handle other errors
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onLogout = () => {
    localStorage.removeItem("token");
    Router.push("/");
  };

  return (
    <Box width="80%" margin="auto" marginTop="5">
      <>
        <Flex justifyContent="space-between">
          <Button onClick={onOpen}>Add New Task</Button>
          <Button onClick={onLogout}>Logout</Button>
        </Flex>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Task</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                    required
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Description</FormLabel>
                  <Input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description"
                    required
                  />
                </FormControl>
                <FormControl mt={4}>
                  <FormLabel>Priority</FormLabel>
                  <Select
                    placeholder="Select priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </Select>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Save
                </Button>
                <Button onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Description</Th>
            <Th>Priority</Th>
            <Th>Due Date</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task.id}>
              <Td>{task.title}</Td>
              <Td>{task.description}</Td>
              <Td>{task.priority}</Td>
              <Td>{task.updated_at}</Td>
              <Td>
                <IconButton
                  aria-label="Delete task"
                  icon={<DeleteIcon />}
                  onClick={() => deleteTask(task.id)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
