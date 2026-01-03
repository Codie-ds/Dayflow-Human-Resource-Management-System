import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmployeeCard } from '@/components/dashboard/EmployeeCard';
import { CheckInPanel } from '@/components/dashboard/CheckInPanel';
import { useRole } from '@/contexts/RoleContext';
import { employees } from '@/lib/mockData';

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin, isHR } = useRole();

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.loginId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Employees</h1>
              <p className="text-sm text-muted-foreground">
                {filteredEmployees.length} team members
              </p>
            </div>

            <div className="flex gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employee..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* New Button (Admin/HR only) */}
              {(isAdmin || isHR) && (
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="mr-2 h-4 w-4" />
                  NEW
                </Button>
              )}
            </div>
          </div>

          {/* Employee Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No employees found</p>
            </div>
          )}
        </div>

        {/* Right Sidebar - Check In Panel */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <CheckInPanel />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
