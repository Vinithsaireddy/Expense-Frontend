import React, { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AddTransactionModal from '@/components/transactions/AddTransactionModal';
import TransactionList from '@/components/transactions/TransactionList';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTransactions } from '@/contexts/TransactionContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Loader2, TrendingUp, TrendingDown, Wallet, CalendarDays } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


const EditTransactionModal = ({ transaction, isOpen, onClose, onTransactionUpdated }) => {
  const { updateTransaction, loading: contextLoading } = useTransactions();
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
      // toast handled in context
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
            <Label htmlFor="edit-expenseType" className="text-right">Type</Label>
            <Select name="expenseType" value={formData.expenseType} onValueChange={(value) => handleSelectChange("expenseType", value)}>
              <SelectTrigger id="edit-expenseType" className="col-span-3 bg-background/70">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-title" className="text-right">Title</Label>
            <Input id="edit-title" name="title" value={formData.title || ''} onChange={handleChange} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-amount" className="text-right">Amount</Label>
            <Input id="edit-amount" name="amount" type="number" value={formData.amount || ''} onChange={handleChange} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-category" className="text-right">Category</Label>
            <Input id="edit-category" name="category" value={formData.category || ''} onChange={handleChange} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-date" className="text-right">Date</Label>
            <Input id="edit-date" name="date" type="date" value={formData.date || ''} onChange={handleChange} className="col-span-3 bg-background/70" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-paymentMethod" className="text-right">Payment Method</Label>
            <Input id="edit-paymentMethod" name="paymentMethod" value={formData.paymentMethod || ''} onChange={handleChange} className="col-span-3 bg-background/70" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edit-description" className="text-right">Description</Label>
            <Input id="edit-description" name="description" value={formData.description || ''} onChange={handleChange} className="col-span-3 bg-background/70" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={contextLoading}>
              {contextLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

const DashboardPage = () => {
  const { user } = useAuth();
  const { transactions, fetchTransactions, loading: transactionsLoading } = useTransactions();
  const navigate = useNavigate();
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [timePeriod, setTimePeriod] = useState('month'); // 'day', 'month', 'year'

  const handleTransactionAddedOrUpdated = () => {
    fetchTransactions(); 
  };

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };
  
  const filteredTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      if (!t.date) return false; // Guard against undefined date
      const transactionDate = new Date(t.date);
      if (timePeriod === 'day') {
        return transactionDate.getFullYear() === now.getFullYear() &&
               transactionDate.getMonth() === now.getMonth() &&
               transactionDate.getDate() === now.getDate();
      } else if (timePeriod === 'month') {
        return transactionDate.getFullYear() === now.getFullYear() && transactionDate.getMonth() === now.getMonth();
      } else if (timePeriod === 'year') {
        return transactionDate.getFullYear() === now.getFullYear();
      }
      return true; 
    });
  }, [transactions, timePeriod]);

  const totalIncome = filteredTransactions
    .filter(t => t.expenseType === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.expenseType === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const barChartData = useMemo(() => {
    const dataMap = new Map();
    
    filteredTransactions.forEach(t => {
      if (!t.date) return;
      const date = new Date(t.date);
      let key;

      if (timePeriod === 'day') {
         key = date.toLocaleTimeString([], { hour: 'numeric', hour12: true }).toLowerCase(); // e.g. "10 am", "1 pm"
      } else if (timePeriod === 'month') {
        key = `Day ${date.getDate()}`;
      } else if (timePeriod === 'year') {
        key = date.toLocaleString('default', { month: 'short' });
      } else { // Default or all-time, might need a different grouping
        key = date.toISOString().split('T')[0]; // Group by full date string if no specific period
      }


      if (!dataMap.has(key)) {
        dataMap.set(key, { name: key, income: 0, expense: 0 });
      }
      const entry = dataMap.get(key);
      if (t.expenseType === 'income') entry.income += t.amount;
      else entry.expense += t.amount;
    });
    
    let sortedData = Array.from(dataMap.values());

    if (timePeriod === 'year') {
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        sortedData.sort((a,b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
    } else if (timePeriod === 'month') {
        sortedData.sort((a,b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
    } else if (timePeriod === 'day') {
        // Sort by hour of the day
        sortedData.sort((a,b) => {
            const timeA = new Date(`1970/01/01 ${a.name.replace(' am', ':00 AM').replace(' pm', ':00 PM')}`);
            const timeB = new Date(`1970/01/01 ${b.name.replace(' am', ':00 AM').replace(' pm', ':00 PM')}`);
            return timeA - timeB;
        });
    }
    return sortedData;
  }, [filteredTransactions, timePeriod]);

  const pieChartData = useMemo(() => {
    const expenseCategories = filteredTransactions
      .filter(t => t.expenseType === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});
    return Object.entries(expenseCategories).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const PIE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#00C49F', '#FFBB28'];


  if (transactionsLoading && transactions.length === 0) {
     return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {user?.name || user?.email || 'User'}!
          </h1>
          <p className="text-muted-foreground">Here's your financial overview.</p>
        </div>
        <AddTransactionModal onTransactionAdded={handleTransactionAddedOrUpdated} />
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-card rounded-lg shadow glassmorphic">
        <h2 className="text-lg font-semibold">Summary for:</h2>
        <Select value={timePeriod} onValueChange={setTimePeriod}>
          <SelectTrigger className="w-full sm:w-[180px] bg-background/70">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-400">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalIncome.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-400">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${totalExpenses.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glassmorphic">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-400">Net Balance</CardTitle>
              <Wallet className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${balance.toFixed(2)}</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {filteredTransactions.length > 0 && barChartData.length > 0 ? (
          <>
            <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.2 }}>
              <Card className="glassmorphic">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CalendarDays /> Income vs Expense ({timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                      <YAxis stroke="hsl(var(--foreground))" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--popover))', 
                          borderColor: 'hsl(var(--border))',
                          color: 'hsl(var(--popover-foreground))',
                          borderRadius: 'var(--radius)'
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '14px' }} />
                      <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y:20 }} animate={{ opacity: 1, y:0 }} transition={{ delay: 0.3 }}>
              <Card className="glassmorphic">
                <CardHeader>
                  <CardTitle>Expense Categories ({timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)})</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] sm:h-[400px]">
                  {pieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={Math.min(120, window.innerWidth / 4.5)} 
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--popover))', 
                            borderColor: 'hsl(var(--border))',
                            color: 'hsl(var(--popover-foreground))',
                            borderRadius: 'var(--radius)'
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: '14px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">No expense data for this period.</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <div className="lg:col-span-2 text-center py-10 text-muted-foreground glassmorphic rounded-lg">
            <p>No transaction data available for the selected period ({timePeriod.charAt(0).toUpperCase() + timePeriod.slice(1)}).</p>
            <p>Try adding some transactions or adjusting the filter.</p>
          </div>
        )}
      </div>
      
      <TransactionList transactions={filteredTransactions.slice(0, 5)} onEditTransaction={handleEditTransaction} />
      {filteredTransactions.length > 5 && (
        <div className="text-center">
          <Button variant="link" onClick={() => navigate('/transactions')}>View All Transactions</Button>
        </div>
      )}


      {editingTransaction && (
        <EditTransactionModal
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

export default DashboardPage;