import React, { useState, useMemo } from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import TransactionList from '@/components/transactions/TransactionList'; 
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Search, Loader2, Filter } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogClose 
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const TransactionsPage = () => {
  const { transactions, fetchTransactions } = useTransactions();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filterDateRange, setFilterDateRange] = useState('all_time'); // 'all_time', 'today', 'this_week', 'this_month', 'this_year'
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'
  const [filterAmountSort, setFilterAmountSort] = useState('date_desc'); // 'date_desc', 'date_asc', 'amount_desc', 'amount_asc'


  const handleTransactionAddedOrUpdated = () => {
    fetchTransactions();
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Date range filter
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (filterDateRange !== 'all_time') {
      filtered = filtered.filter(t => {
        if (!t.date) return false;
        const transactionDate = new Date(t.date);
        
        if (filterDateRange === 'today') {
          return transactionDate.getFullYear() === today.getFullYear() &&
                 transactionDate.getMonth() === today.getMonth() &&
                 transactionDate.getDate() === today.getDate();
        }
        if (filterDateRange === 'this_week') {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1)); // Monday as start of week
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          return transactionDate >= startOfWeek && transactionDate <= endOfWeek;
        }
        if (filterDateRange === 'this_month') {
          return transactionDate.getFullYear() === now.getFullYear() && transactionDate.getMonth() === now.getMonth();
        }
        if (filterDateRange === 'this_year') {
          return transactionDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.expenseType === filterType);
    }

    // Amount sort
    switch (filterAmountSort) {
      case 'date_desc':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'date_asc':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'amount_desc':
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case 'amount_asc':
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      default:
        break;
    }
    return filtered;
  }, [transactions, searchTerm, filterDateRange, filterType, filterAmountSort]);

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-foreground">All Transactions</h1>
        <AddTransactionModal onTransactionAdded={handleTransactionAddedOrUpdated} />
      </div>

      <div className="p-4 bg-card rounded-lg shadow glassmorphic space-y-4">
        <div className="relative flex-grow w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Search by title, category, or description..."
            className="pl-10 w-full bg-background/70"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div>
            <Label htmlFor="filter-date-range" className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <Filter className="h-4 w-4" /> Date Range
            </Label>
            <Select value={filterDateRange} onValueChange={setFilterDateRange}>
              <SelectTrigger id="filter-date-range" className="w-full bg-background/70">
                <SelectValue placeholder="Filter by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_time">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="this_week">This Week</SelectItem>
                <SelectItem value="this_month">This Month</SelectItem>
                <SelectItem value="this_year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-type" className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <Filter className="h-4 w-4" /> Type
            </Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger id="filter-type" className="w-full bg-background/70">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="filter-amount-sort" className="text-sm font-medium text-muted-foreground flex items-center gap-1 mb-1">
              <Filter className="h-4 w-4" /> Sort By
            </Label>
            <Select value={filterAmountSort} onValueChange={setFilterAmountSort}>
              <SelectTrigger id="filter-amount-sort" className="w-full bg-background/70">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Date (Newest first)</SelectItem>
                <SelectItem value="date_asc">Date (Oldest first)</SelectItem>
                <SelectItem value="amount_desc">Amount (High to Low)</SelectItem>
                <SelectItem value="amount_asc">Amount (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <TransactionList 
        transactions={filteredAndSortedTransactions} 
        onEditTransaction={handleEditTransaction}
        showTitle={false} 
      />

      {editingTransaction && (
        <EditTransactionModalInternal
          transaction={editingTransaction}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTransaction(null);
          }}
          onTransactionUpdated={handleTransactionAddedOrUpdated}
        />
      )}
    </motion.div>
  );
};

const EditTransactionModalInternal = ({ transaction, isOpen, onClose, onTransactionUpdated }) => {
  const { updateTransaction, loading } = useTransactions(); 
  const [formData, setFormData] = useState(transaction);

  React.useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : '',
      });
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToUpdate = { ...formData, amount: parseFloat(formData.amount) };
    const transactionId = transaction.id || transaction._id;
    delete dataToUpdate._id;
    delete dataToUpdate.id;
    
    try {
      const updated = await updateTransaction(transactionId, dataToUpdate);
      if (updated) {
        onTransactionUpdated(updated);
        onClose();
      }
    } catch (error) {
      // Error handled by toast in context
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
          <DialogDescription>Update the details of your transaction.</DialogDescription>
        </DialogHeader>
        <motion.form onSubmit={handleSubmit} className="grid gap-4 py-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tx-expenseType" className="text-right">Type</Label>
            <Select name="expenseType" value={formData.expenseType} onValueChange={(value) => handleSelectChange("expenseType", value)}>
              <SelectTrigger id="edit-tx-expenseType" className="col-span-3 bg-background/70">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tx-title" className="text-right">Title</Label>
            <Input id="edit-tx-title" name="title" value={formData.title || ''} onChange={handleChange} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tx-amount" className="text-right">Amount</Label>
            <Input id="edit-tx-amount" name="amount" type="number" value={formData.amount || ''} onChange={handleChange} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tx-category" className="text-right">Category</Label>
            <Input id="edit-tx-category" name="category" value={formData.category || ''} onChange={handleChange} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tx-date" className="text-right">Date</Label>
            <Input id="edit-tx-date" name="date" type="date" value={formData.date || ''} onChange={handleChange} className="col-span-3 bg-background/70" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tx-paymentMethod" className="text-right">Payment Method</Label>
            <Input id="edit-tx-paymentMethod" name="paymentMethod" value={formData.paymentMethod || ''} onChange={handleChange} className="col-span-3 bg-background/70" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-tx-description" className="text-right">Description</Label>
            <Input id="edit-tx-description" name="description" value={formData.description || ''} onChange={handleChange} className="col-span-3 bg-background/70" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};


export default TransactionsPage;