import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import Router from "next/router";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low"); // Default priority
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    console.log(token);
    if (!token) {
      // If no token, redirect to login
      Router.push("/");
    }

    // API call to add a new task
    try {
      const response = await fetch("http://0.0.0.0:8000/tasks/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Replace with actual token
        },
        body: JSON.stringify({
          title,
          description,
          created_by: 1, // Assuming the created_by field is needed
          priority,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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

      // Optional: Refresh tasks or update state to show the new task
    } catch (error) {
      console.error("Error adding task:", error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    console.log(token);
    if (!token) {
      // If no token, redirect to login
      Router.push("/");
    }
    const fetchTasks = async () => {
      const response = await fetch("http://0.0.0.0:8000/tasks/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your actual token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    };

    fetchTasks();
  }, []);

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
          </Tr>
        </Thead>
        <Tbody>
          {tasks.map((task) => (
            <Tr key={task.id}>
              <Td>{task.title}</Td>
              <Td>{task.description}</Td>
              <Td>{task.priority}</Td>
              <Td>{task.updated_at}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
