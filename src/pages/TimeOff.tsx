import { useState } from 'react';
import { Plus, Search, Check, X, Upload, Info, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRole } from '@/contexts/RoleContext';
import { timeOffRequests, currentUser, employees } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function TimeOff() {
  const { isAdmin, isHR, isEmployee } = useRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [requests, setRequests] = useState(timeOffRequests);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [formData, setFormData] = useState({
    type: '',
    days: '',
  });

  // Filter requests based on role
  const filteredRequests = requests.filter((req) => {
    // Employee sees only their own
    if (isEmployee && !isAdmin && !isHR) {
      if (req.employeeId !== currentUser.id) return false;
    }
    
    // Search filter
    if (searchQuery) {
      return req.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    
    return true;
  });

  const handleApprove = (id: string) => {
    setRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'approved' as const } : req)
    );
  };

  const handleReject = (id: string) => {
    setRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: 'rejected' as const } : req)
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/20 text-success border-0">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive/20 text-destructive border-0">Rejected</Badge>;
      default:
        return <Badge className="bg-warning/20 text-warning border-0">Pending</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'paid':
        return <Badge variant="outline" className="border-primary/30 text-primary">Paid</Badge>;
      case 'sick':
        return <Badge variant="outline" className="border-info/30 text-info">Sick</Badge>;
      default:
        return <Badge variant="outline" className="border-muted-foreground/30 text-muted-foreground">Unpaid</Badge>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h1 className="text-2xl font-semibold text-foreground">Time Off</h1>
          
          <div className="flex gap-3">
            {(isAdmin || isHR) && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            )}
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  NEW
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border text-foreground">
                <DialogHeader>
                  <DialogTitle>Request Time Off</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Employee</Label>
                    <Input
                      value={currentUser.name}
                      disabled
                      className="bg-secondary border-border text-foreground"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Time-Off Type</Label>
                    <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="paid">Paid Time Off</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-secondary border-border",
                              !startDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-secondary border-border",
                              !endDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-card border-border" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Number of Days</Label>
                    <Input
                      type="number"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                      className="bg-secondary border-border text-foreground"
                      placeholder="Enter days"
                    />
                  </div>
                  
                  {formData.type === 'sick' && (
                    <div className="space-y-2">
                      <Label>Attachment (for sick leave)</Label>
                      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Upload certificate</p>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-border">
                    Discard
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={() => setIsDialogOpen(false)}>
                    Submit
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Paid Time Off</p>
              <p className="text-2xl font-semibold text-foreground">24 <span className="text-sm font-normal text-muted-foreground">Days Available</span></p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Sick Time Off</p>
              <p className="text-2xl font-semibold text-foreground">07 <span className="text-sm font-normal text-muted-foreground">Days Available</span></p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-6">
          {/* Main Table */}
          <Card className="flex-1 bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">
                {(isAdmin || isHR) ? 'All Time Off Requests' : 'My Time Off Requests'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Start Date</TableHead>
                    <TableHead className="text-muted-foreground">End Date</TableHead>
                    <TableHead className="text-muted-foreground">Type</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    {(isAdmin || isHR) && (
                      <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className="border-border">
                      <TableCell className="font-medium text-foreground">
                        {request.employeeName}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {new Date(request.startDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-foreground">
                        {new Date(request.endDate).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell>{getTypeBadge(request.type)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      {(isAdmin || isHR) && (
                        <TableCell className="text-right">
                          {request.status === 'pending' && (
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 border-success/30 text-success hover:bg-success/10"
                                onClick={() => handleApprove(request.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 border-destructive/30 text-destructive hover:bg-destructive/10"
                                onClick={() => handleReject(request.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredRequests.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No time off requests found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Note Panel */}
          <Card className="hidden lg:block w-72 shrink-0 bg-card border-border h-fit">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Info className="h-4 w-4 text-info" />
                Note
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Employees can view only their own time-off records, while Admins and HR Officers 
                can view time-off records and approve or reject them for all employees.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
