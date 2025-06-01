
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTransactions } from '@/contexts/TransactionContext';
import { PlusCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const AddTransactionModal = ({ onTransactionAdded }) => {
  const [open, setOpen] = useState(false);
  const [expenseType, setExpenseType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [description, setDescription] = useState('');
  
  const { addTransaction, loading } = useTransactions();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = await addTransaction({
        expenseType,
        title,
        amount: parseFloat(amount),
        category,
        date,
        paymentMethod,
        description,
      });
      if (newTransaction) {
        if (onTransactionAdded) onTransactionAdded(newTransaction);
        setOpen(false); // Close dialog on success
        // Reset form
        setExpenseType('expense');
        setTitle('');
        setAmount('');
        setCategory('');
        setDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod('');
        setDescription('');
      }
    } catch (error) {
      // Error is handled by toast in context
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-brand-teal to-brand-purple hover:opacity-90 transition-opacity">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] glassmorphic">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Fill in the details for your new transaction.
          </DialogDescription>
        </DialogHeader>
        <motion.form 
          onSubmit={handleSubmit} 
          className="grid gap-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expenseType" className="text-right">Type</Label>
            <Select value={expenseType} onValueChange={setExpenseType}>
              <SelectTrigger className="col-span-3 bg-background/70">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">Amount</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="col-span-3 bg-background/70" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="col-span-3 bg-background/70" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="paymentMethod" className="text-right">Payment Method</Label>
            <Input id="paymentMethod" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="col-span-3 bg-background/70" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 bg-background/70" />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-brand-purple to-brand-pink hover:opacity-90">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Transaction"}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionModal;
