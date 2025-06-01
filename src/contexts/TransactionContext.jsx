
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { 
  createTransactionApi, 
  getAllTransactionsApi, 
  updateTransactionApi, 
  deleteTransactionApi,
  getTransactionByIdApi
} from '@/services/api';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setTransactions([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getAllTransactionsApi(token);
      setTransactions(data || []);
    } catch (err) {
      setError(err.message);
      toast({ title: "Error fetching transactions", description: err.message, variant: "destructive" });
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [token, isAuthenticated, toast]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const addTransaction = async (transactionData) => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    try {
      const newTransaction = await createTransactionApi(transactionData, token);
      setTransactions(prev => [newTransaction, ...prev]);
      toast({ title: "Transaction Added", description: "Successfully added new transaction." });
      return newTransaction;
    } catch (err) {
      toast({ title: "Error adding transaction", description: err.message, variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  const updateTransaction = async (id, transactionData) => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    try {
      const updatedTransaction = await updateTransactionApi(id, transactionData, token);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
      toast({ title: "Transaction Updated", description: "Successfully updated transaction." });
      return updatedTransaction;
    } catch (err) {
      toast({ title: "Error updating transaction", description: err.message, variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    try {
      await deleteTransactionApi(id, token);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast({ title: "Transaction Deleted", description: "Successfully deleted transaction." });
    } catch (err) {
      toast({ title: "Error deleting transaction", description: err.message, variant: "destructive" });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTransactionById = async (id) => {
    if (!isAuthenticated || !token) return null;
    setLoading(true);
    try {
      const transaction = await getTransactionByIdApi(id, token);
      return transaction;
    } catch (err) {
      toast({ title: "Error fetching transaction", description: err.message, variant: "destructive" });
      return null;
    } finally {
      setLoading(false);
    }
  };


  return (
    <TransactionContext.Provider value={{ 
      transactions, 
      loading, 
      error, 
      fetchTransactions, 
      addTransaction, 
      updateTransaction, 
      deleteTransaction,
      getTransactionById
    }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionContext);
