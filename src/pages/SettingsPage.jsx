import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sun, Moon, Palette, Bell, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold text-foreground">Settings</h1>

      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Palette /> Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="theme-toggle" className="text-lg">Theme</Label>
            <Button
              id="theme-toggle"
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="bg-background/70"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Current theme: <span className="font-semibold capitalize">{theme}</span>
          </p>
        </CardContent>
      </Card>

      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Bell /> Notifications</CardTitle>
          <CardDescription>Manage your notification preferences (UI only).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="email-notifications" className="text-lg">Email Notifications</Label>
            <Button variant="outline" disabled className="bg-background/70">Toggle</Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <Label htmlFor="push-notifications" className="text-lg">Push Notifications</Label>
            <Button variant="outline" disabled className="bg-background/70">Toggle</Button>
          </div>
           <p className="text-sm text-muted-foreground">
            Notification settings are currently for display purposes only and are not functional.
          </p>
        </CardContent>
      </Card>

      <Card className="glassmorphic">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield /> Account</CardTitle>
          <CardDescription>Manage your account settings (UI only).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" disabled className="w-full sm:w-auto bg-background/70">Change Password</Button>
          <Button variant="destructive" disabled className="w-full sm:w-auto">Delete Account</Button>
           <p className="text-sm text-muted-foreground">
            Account management features are currently for display purposes only and are not functional.
          </p>
        </CardContent>
      </Card>

    </motion.div>
  );
};

export default SettingsPage;