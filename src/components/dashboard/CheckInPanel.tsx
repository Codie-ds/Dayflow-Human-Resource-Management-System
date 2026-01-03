import { useState, useEffect } from 'react';
import { Clock, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export function CheckInPanel() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setIsCheckedIn(true);
    setCheckInTime(new Date());
  };

  const handleCheckOut = () => {
    setIsCheckedIn(false);
    setCheckInTime(null);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getElapsedTime = () => {
    if (!checkInTime) return null;
    const diff = currentTime.getTime() - checkInTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Indicator */}
        <div className="flex items-center justify-center gap-2">
          <span
            className={cn(
              'h-3 w-3 rounded-full',
              isCheckedIn ? 'bg-success' : 'bg-destructive'
            )}
          />
          <span className="text-sm text-muted-foreground">
            {isCheckedIn ? 'Checked In' : 'Not Checked In'}
          </span>
        </div>

        {/* Current Time */}
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">
            {formatTime(currentTime)}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Elapsed Time */}
        {isCheckedIn && checkInTime && (
          <div className="text-center p-2 rounded-lg bg-success/10 border border-success/20">
            <p className="text-xs text-muted-foreground">Working since</p>
            <p className="text-lg font-medium text-success">{getElapsedTime()}</p>
            <p className="text-xs text-muted-foreground">
              Since {formatTime(checkInTime)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isCheckedIn ? (
            <Button
              onClick={handleCheckIn}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Check In
            </Button>
          ) : (
            <Button
              onClick={handleCheckOut}
              variant="outline"
              className="w-full border-border hover:bg-muted"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Check Out
            </Button>
          )}
        </div>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Employees can mark their attendance using the Check In / Check Out system, 
          and view attendance records through the Attendance module.
        </p>
      </CardContent>
    </Card>
  );
}
