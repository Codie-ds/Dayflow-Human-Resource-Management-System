import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, Calendar, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRole } from '@/contexts/RoleContext';
import { generateAttendanceRecords, currentUser } from '@/lib/mockData';

export default function Attendance() {
  const { isAdmin, isHR, isEmployee } = useRole();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());

  // Generate records once
  const allRecords = useMemo(() => generateAttendanceRecords(), []);
  
  // Filter records based on role and date
  const filteredRecords = useMemo(() => {
    let records = allRecords;
    
    // Employee can only see their own records
    if (isEmployee && !isAdmin && !isHR) {
      records = records.filter(r => r.employeeId === currentUser.id);
    }
    
    // Filter by selected date for admin view
    if (isAdmin || isHR) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      records = records.filter(r => r.date === dateStr);
    } else {
      // Filter by selected month for employee view
      records = records.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate.getMonth() === parseInt(selectedMonth);
      });
    }
    
    // Search filter
    if (searchQuery) {
      records = records.filter(r => 
        r.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return records;
  }, [allRecords, selectedDate, selectedMonth, searchQuery, isAdmin, isHR, isEmployee]);

  // Summary stats for employee view
  const summaryStats = useMemo(() => {
    if (!isEmployee || isAdmin || isHR) return null;
    
    const monthRecords = allRecords.filter(r => {
      const recordDate = new Date(r.date);
      return recordDate.getMonth() === parseInt(selectedMonth) && 
             r.employeeId === currentUser.id;
    });
    
    const presentDays = monthRecords.filter(r => r.checkIn !== null).length;
    const totalDays = monthRecords.length;
    
    return {
      present: presentDays,
      absent: totalDays - presentDays,
      total: totalDays,
    };
  }, [allRecords, selectedMonth, isEmployee, isAdmin, isHR]);

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'prev' ? -1 : 1));
    setSelectedDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <h1 className="text-2xl font-semibold text-foreground">Attendance</h1>

          {/* Admin: Date Navigation */}
          {(isAdmin || isHR) && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate('prev')}
                className="border-border"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border min-w-[280px] justify-center">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{formatDate(selectedDate)}</span>
              </div>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate('next')}
                className="border-border"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Employee: Month Selector */}
          {isEmployee && !isAdmin && !isHR && (
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-40 bg-card border-border">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {months.map((month, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Employee Summary Cards */}
        {isEmployee && !isAdmin && !isHR && summaryStats && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-success">{summaryStats.present}</p>
                <p className="text-sm text-muted-foreground">Present Days</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-warning">{summaryStats.absent}</p>
                <p className="text-sm text-muted-foreground">Absent Days</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-semibold text-foreground">{summaryStats.total}</p>
                <p className="text-sm text-muted-foreground">Working Days</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="flex gap-6">
          {/* Main Table */}
          <Card className="flex-1 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-base">
                {(isAdmin || isHR) ? 'All Employees' : 'My Attendance'}
              </CardTitle>
              
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
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    {(isAdmin || isHR) && (
                      <TableHead className="text-muted-foreground">Employee Name</TableHead>
                    )}
                    {isEmployee && !isAdmin && !isHR && (
                      <TableHead className="text-muted-foreground">Date</TableHead>
                    )}
                    <TableHead className="text-muted-foreground">Check In</TableHead>
                    <TableHead className="text-muted-foreground">Check Out</TableHead>
                    <TableHead className="text-muted-foreground">Work Hours</TableHead>
                    <TableHead className="text-muted-foreground">Extra Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.slice(0, 15).map((record) => (
                    <TableRow key={record.id} className="border-border">
                      {(isAdmin || isHR) && (
                        <TableCell className="font-medium text-foreground">
                          {record.employeeName}
                        </TableCell>
                      )}
                      {isEmployee && !isAdmin && !isHR && (
                        <TableCell className="text-foreground">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </TableCell>
                      )}
                      <TableCell className={record.checkIn ? 'text-success' : 'text-muted-foreground'}>
                        {record.checkIn || '-'}
                      </TableCell>
                      <TableCell className={record.checkOut ? 'text-foreground' : 'text-muted-foreground'}>
                        {record.checkOut || '-'}
                      </TableCell>
                      <TableCell className="text-foreground">{record.workHours}</TableCell>
                      <TableCell className={record.extraHours !== '-' ? 'text-primary' : 'text-muted-foreground'}>
                        {record.extraHours}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredRecords.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No attendance records found</p>
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
              <ul className="text-xs text-muted-foreground space-y-2">
                <li>• Attendance is based on assigned attendance source</li>
                <li>• Users see date-wise attendance by default</li>
                <li>• Month view shows detailed working time including breaks</li>
                <li>• Admin / HR can see attendance of all employees</li>
                <li>• Attendance data is the basis for payroll generation</li>
                <li>• Unpaid leave or missing attendance reduces payable days</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
