import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Employee } from '@/lib/mockData';
import { cn } from '@/lib/utils';

interface EmployeeCardProps {
  employee: Employee;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const navigate = useNavigate();

  const getStatusIndicator = () => {
    switch (employee.status) {
      case 'present':
        return (
          <div className="absolute top-3 right-3">
            <span className="flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
          </div>
        );
      case 'leave':
        return (
          <div className="absolute top-3 right-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-info/20">
              <Plane className="h-3.5 w-3.5 text-info" />
            </div>
          </div>
        );
      case 'absent':
        return (
          <div className="absolute top-3 right-3">
            <span className="flex h-3 w-3 rounded-full bg-warning"></span>
          </div>
        );
    }
  };

  return (
    <Card
      className={cn(
        'relative p-4 bg-card border-border cursor-pointer transition-all duration-200',
        'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'
      )}
      onClick={() => navigate(`/employee/${employee.id}`)}
    >
      {getStatusIndicator()}
      
      <div className="flex flex-col items-center text-center space-y-3">
        <Avatar className="h-16 w-16 border-2 border-border">
          <AvatarImage src={employee.avatar} alt={employee.name} />
          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
            {employee.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-1">
          <h3 className="font-medium text-foreground">{employee.name}</h3>
          <p className="text-sm text-muted-foreground">{employee.designation}</p>
          <p className="text-xs text-muted-foreground/70">{employee.loginId}</p>
        </div>
      </div>
    </Card>
  );
}
