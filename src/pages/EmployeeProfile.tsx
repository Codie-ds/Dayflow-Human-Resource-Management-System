import { useParams } from 'react-router-dom';
import { Pencil, MapPin, Mail, Phone, Building, Users, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { useRole } from '@/contexts/RoleContext';
import { employees } from '@/lib/mockData';

export default function EmployeeProfile() {
  const { id } = useParams();
  const { isAdmin, isHR } = useRole();
  
  const employee = employees.find((e) => e.id === id) || employees[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const monthlyWage = employee.basicSalary + employee.hra + employee.standardAllowance + 
    employee.performanceBonus + employee.lta + employee.fixedAllowance;
  const yearlyWage = monthlyWage * 12;

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="h-28 w-28 border-4 border-border">
                  <AvatarImage src={employee.avatar} alt={employee.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl">
                    {employee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {(isAdmin || isHR) && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full border-border bg-card"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">{employee.name}</h1>
                  <p className="text-muted-foreground">{employee.designation}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{employee.loginId}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{employee.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{employee.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="h-4 w-4" />
                    <span>{employee.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{employee.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Manager: {employee.manager}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="resume" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="resume" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Resume
            </TabsTrigger>
            <TabsTrigger value="private" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Private Info
            </TabsTrigger>
            {(isAdmin || isHR) && (
              <TabsTrigger value="salary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Salary Info
              </TabsTrigger>
            )}
          </TabsList>

          {/* Resume Tab */}
          <TabsContent value="resume" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {employee.about}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">What I Love About My Job</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {employee.whatILove}
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">My Interests & Hobbies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {employee.interests}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Skills</CardTitle>
                    {(isAdmin || isHR) && (
                      <Button variant="ghost" size="sm" className="text-primary text-xs">
                        + Add Skills
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="border-primary/30 text-foreground bg-primary/10"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">Certifications</CardTitle>
                    {(isAdmin || isHR) && (
                      <Button variant="ghost" size="sm" className="text-primary text-xs">
                        + Add Certification
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {employee.certifications.map((cert) => (
                        <li key={cert} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Private Info Tab */}
          <TabsContent value="private" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Details */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Personal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date of Birth</p>
                      <p className="text-foreground">{new Date(employee.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gender</p>
                      <p className="text-foreground">{employee.gender}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Nationality</p>
                      <p className="text-foreground">{employee.nationality}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Marital Status</p>
                      <p className="text-foreground">{employee.maritalStatus}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Residing Address</p>
                      <p className="text-foreground">{employee.address}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Personal Email</p>
                      <p className="text-foreground">{employee.personalEmail}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date of Joining</p>
                      <p className="text-foreground">{new Date(employee.dateOfJoining).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Bank & Government Details */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Bank & Government Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Bank Name</p>
                      <p className="text-foreground">{employee.bankName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Account Number</p>
                      <p className="text-foreground">{employee.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">IFSC Code</p>
                      <p className="text-foreground">{employee.ifscCode}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">PAN No</p>
                      <p className="text-foreground">{employee.panNo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">UAN No</p>
                      <p className="text-foreground">{employee.uanNo}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Emp Code</p>
                      <p className="text-foreground">{employee.empCode}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Salary Info Tab (Admin Only) */}
          {(isAdmin || isHR) && (
            <TabsContent value="salary" className="space-y-6">
              {/* Salary Summary */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-base">Salary Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-4 gap-6">
                    <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                      <p className="text-sm text-muted-foreground">Monthly Wage</p>
                      <p className="text-xl font-semibold text-foreground">{formatCurrency(monthlyWage)}</p>
                      <p className="text-xs text-muted-foreground">/ Month</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary border border-border">
                      <p className="text-sm text-muted-foreground">Yearly Wage</p>
                      <p className="text-xl font-semibold text-foreground">{formatCurrency(yearlyWage)}</p>
                      <p className="text-xs text-muted-foreground">/ Year</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary border border-border">
                      <p className="text-sm text-muted-foreground">Working Days/Week</p>
                      <p className="text-xl font-semibold text-foreground">5</p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary border border-border">
                      <p className="text-sm text-muted-foreground">Break Time</p>
                      <p className="text-xl font-semibold text-foreground">1 hr</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Salary Components */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-base">Salary Components</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { name: 'Basic Salary', amount: employee.basicSalary, percent: 50 },
                      { name: 'House Rent Allowance', amount: employee.hra, percent: 20 },
                      { name: 'Standard Allowance', amount: employee.standardAllowance, percent: 10 },
                      { name: 'Performance Bonus', amount: employee.performanceBonus, percent: 5 },
                      { name: 'Leave Travel Allowance', amount: employee.lta, percent: 3 },
                      { name: 'Fixed Allowance', amount: employee.fixedAllowance, percent: 2 },
                    ].map((component) => (
                      <div key={component.name} className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-foreground">{component.name}</p>
                          <p className="text-xs text-muted-foreground">{component.percent}% of CTC</p>
                        </div>
                        <p className="font-medium text-foreground">{formatCurrency(component.amount)}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Deductions */}
                <div className="space-y-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Provident Fund (PF) Contribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-foreground">Employee Contribution</p>
                          <p className="text-xs text-muted-foreground">12% of Basic</p>
                        </div>
                        <p className="font-medium text-foreground">{formatCurrency(employee.pfEmployee)}</p>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-foreground">Employer Contribution</p>
                          <p className="text-xs text-muted-foreground">12% of Basic</p>
                        </div>
                        <p className="font-medium text-foreground">{formatCurrency(employee.pfEmployer)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground border-t border-border pt-2">
                        PF is calculated based on basic salary
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-base">Tax Deductions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center text-sm">
                        <div>
                          <p className="text-foreground">Professional Tax</p>
                          <p className="text-xs text-muted-foreground">Monthly deduction</p>
                        </div>
                        <p className="font-medium text-foreground">{formatCurrency(employee.professionalTax)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
}
