import React, { useState } from "react";
import { Box, Button, Flex, FormControl, FormLabel, Input, Select, Text, VStack, HStack, IconButton, useToast, Table, Thead, Tbody, Tr, Th, Td, NumberInput, NumberInputField, Tag } from "@chakra-ui/react";
import { FaPlus, FaEdit, FaTrash, FaDownload } from "react-icons/fa";

const Index = () => {
  const toast = useToast();
  const initialFormData = { date: "", amount: "", type: "income", category: "" };
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingId, setEditingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAmountChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      amount: value,
    }));
  };

  const addTransaction = () => {
    if (editingId !== null) {
      setTransactions((prevTransactions) => prevTransactions.map((transaction) => (transaction.id === editingId ? { ...transaction, ...formData } : transaction)));
      setEditingId(null);
    } else {
      const newTransaction = {
        id: Date.now(),
        ...formData,
      };
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
    }
    setFormData(initialFormData);
  };

  const editTransaction = (id) => {
    const transaction = transactions.find((t) => t.id === id);
    setFormData(transaction);
    setEditingId(id);
  };

  const deleteTransaction = (id) => {
    setTransactions((prevTransactions) => prevTransactions.filter((t) => t.id !== id));
  };

  const exportTransactions = () => {
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(transactions))}`;
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "transactions.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const calculateBalance = () =>
    transactions
      .reduce((acc, transaction) => {
        return transaction.type === "income" ? acc + parseFloat(transaction.amount) : acc - parseFloat(transaction.amount);
      }, 0)
      .toFixed(2);

  return (
    <VStack spacing={4} align="stretch">
      <Box p={5} shadow="md" borderWidth="1px">
        <VStack spacing={3}>
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input type="date" name="date" value={formData.date} onChange={handleInputChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Amount</FormLabel>
            <NumberInput precision={2} step={0.01} min={0} onChange={handleAmountChange}>
              <NumberInputField name="amount" value={formData.amount} />
            </NumberInput>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Type</FormLabel>
            <Select name="type" value={formData.type} onChange={handleInputChange}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Category</FormLabel>
            <Select name="category" value={formData.category} onChange={handleInputChange}>
              <option value="groceries">Groceries</option>
              <option value="bills">Bills</option>
              <option value="salary">Salary</option>
              {/* Add more categories as needed */}
            </Select>
          </FormControl>
          <Button leftIcon={<FaPlus />} colorScheme="teal" variant="solid" onClick={addTransaction}>
            {editingId !== null ? "Edit Transaction" : "Add Transaction"}
          </Button>
        </VStack>
      </Box>

      <Flex justifyContent="space-between" alignItems="center" p={5}>
        <Text fontSize="xl">Transactions</Text>
        <Button leftIcon={<FaDownload />} onClick={exportTransactions}>
          Export
        </Button>
      </Flex>

      <Box p={5}>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Type</Th>
              <Th>Category</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{transaction.date}</Td>
                <Td isNumeric>{transaction.amount}</Td>
                <Td>
                  <Tag colorScheme={transaction.type === "income" ? "green" : "red"}>{transaction.type}</Tag>
                </Td>
                <Td>{transaction.category}</Td>
                <Td>
                  <IconButton icon={<FaEdit />} aria-label="Edit" size="sm" mr={2} onClick={() => editTransaction(transaction.id)} />
                  <IconButton icon={<FaTrash />} aria-label="Delete" size="sm" colorScheme="red" onClick={() => deleteTransaction(transaction.id)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Flex justifyContent="space-between" alignItems="center" p={5}>
        <Text fontSize="xl">Total Balance:</Text>
        <Tag colorScheme="blue" size="lg">
          ${calculateBalance()}
        </Tag>
      </Flex>
    </VStack>
  );
};

export default Index;
