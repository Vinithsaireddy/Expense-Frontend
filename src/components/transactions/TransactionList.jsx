import React from 'react';
import { useTransactions } from '@/contexts/TransactionContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button, buttonVariants } from '@/components/ui/button';
import { Edit, Trash2, Loader2, PackageOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';


const TransactionList = ({ transactions: transactionsProp, onEditTransaction, showTitle = true }) => {
  const { loading: contextLoading, error, deleteTransaction } = useTransactions();
  const [itemToDelete, setItemToDelete] = React.useState(null);

  // Use transactionsProp if provided, otherwise fallback to context (though prop is preferred for this component)
  const transactionsToDisplay = transactionsProp || [];


  const handleDelete = async () => {
    if (itemToDelete) {
      await deleteTransaction(itemToDelete.id || itemToDelete._id); 
      setItemToDelete(null);
    }
  };

  if (contextLoading && transactionsToDisplay.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error && transactionsToDisplay.length === 0) { // Only show general error if no specific transactions are passed
    return <p className="text-destructive text-center">Error loading transactions: {error}</p>;
  }

  if (transactionsToDisplay.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center text-muted-foreground py-10 glassmorphic rounded-lg"
      >
        <PackageOpen className="mx-auto mb-4 h-16 w-16 opacity-50 text-primary" />
        <h3 className="text-xl font-semibold">No Transactions Found</h3>
        <p>Looks like there's nothing here yet, or your filters cleared the list!</p>
      </motion.div>
    );
  }

  return (
    <Card className="glassmorphic">
      {showTitle && (
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
      )}
      <CardContent className={!showTitle ? "pt-6" : ""}>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {transactionsToDisplay.map((transaction) => (
                  <motion.tr
                    key={transaction.id || transaction._id} 
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-muted/20"
                  >
                    <TableCell className="font-medium whitespace-nowrap">{transaction.title}</TableCell>
                    <TableCell className={cn(
                      "whitespace-nowrap",
                      transaction.expenseType === 'income' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                    )}>
                      ${transaction.amount ? transaction.amount.toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{transaction.category}</TableCell>
                    <TableCell className="whitespace-nowrap">{transaction.date ? new Date(transaction.date).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                        transaction.expenseType === 'income' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' 
                          : 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100'
                      }`}>
                        {transaction.expenseType}
                      </span>
                    </TableCell>
                    <TableCell className="text-right space-x-1 sm:space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onEditTransaction(transaction)} aria-label="Edit transaction">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={() => setItemToDelete(transaction)} aria-label="Delete transaction">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the transaction titled "{itemToDelete?.title}".
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className={cn(buttonVariants({ variant: "destructive" }))}>
                              {contextLoading && itemToDelete && (itemToDelete.id === (transaction.id || transaction._id) || itemToDelete._id === (transaction.id || transaction._id)) ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
            {transactionsToDisplay.length > 10 && <TableCaption>A list of your transactions.</TableCaption>}
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;