import React from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { User, Mail, Shield, Zap, ChevronLeft, LogOut, FileText, Database } from 'lucide-react';

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  // Mock usage data
  const usageStats = [
    { label: 'Files Processed', value: '42', icon: FileText, color: 'text-primary' },
    { label: 'Predictions Made', value: '128', icon: Zap, color: 'text-blue-500' },
    { label: 'Anomalies Detected', value: '15', icon: Shield, color: 'text-red-500' },
    { label: 'Storage Used', value: '2.4 MB', icon: Database, color: 'text-indigo-500' },
  ];

  return (
    <div className="container py-12 animate-fade-in relative min-h-screen">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="absolute left-6 top-6 text-muted-foreground hover:text-primary gap-1 font-semibold"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Home
      </Button>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            User Profile
          </h1>
          <p className="text-muted-foreground">Manage your account and workspace configuration.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Identity Card */}
          <Card className="md:col-span-1 bg-card border-border/50">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-4 border-background shadow-lg overflow-hidden">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="h-12 w-12 text-primary" />
                )}
              </div>
              <CardTitle className="text-xl font-bold">{user.user_metadata?.display_name || 'User'}</CardTitle>
              <CardDescription className="font-medium">{user.email}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-primary" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-4 w-4 text-blue-500" />
                <span>Security: Verified</span>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive font-bold"
                onClick={() => { signOut(); navigate('/'); }}
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </Button>
            </CardContent>
          </Card>

          {/* Statistics Grid */}
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {usageStats.map((stat, i) => (
                <Card key={i} className="bg-card border-border/50 hover:border-primary/20 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      <span className="text-2xl font-bold">{stat.value}</span>
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-card border-border/50">
              <CardHeader>
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-primary">Inference History</CardTitle>
                <CardDescription>Recent activities in the workspace.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'order_data.xml', date: '2 hours ago', status: 'Success' },
                    { name: 'inventory_v2.xml', date: '5 hours ago', status: 'Success' },
                    { name: 'employees.xml', date: '1 day ago', status: 'Incomplete' },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-muted/30 border border-border/50">
                      <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${item.status === 'Success' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
