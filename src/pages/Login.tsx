import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    loginId: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setServerError('');

    // Frontend validation
    const newErrors = { loginId: '', password: '' };
    if (!formData.loginId) newErrors.loginId = 'Login ID or Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    if (newErrors.loginId || newErrors.password) return;

    try {
      setIsLoading(true);

      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Backend accepts either email or login_id
          email: formData.loginId.includes('@') ? formData.loginId : undefined,
          login_id: !formData.loginId.includes('@') ? formData.loginId : undefined,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Store JWT token & user info
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // ✅ Redirect to dashboard
      navigate('/dashboard');

    } catch (err) {
      setServerError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-background p-4">
      <Card className="w-full max-w-md bg-card border-border animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <span className="text-2xl font-bold text-primary-foreground">D</span>
          </div>
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground">
              Human Resource Management System
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Sign in to your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">

            {serverError && (
              <p className="text-sm text-destructive text-center">{serverError}</p>
            )}

            <div className="space-y-2">
              <Label htmlFor="loginId" className="text-foreground">
                Login ID / Email
              </Label>
              <Input
                id="loginId"
                type="text"
                placeholder="Enter Login ID or Email"
                value={formData.loginId}
                onChange={(e) =>
                  setFormData({ ...formData, loginId: e.target.value })
                }
              />
              {errors.loginId && (
                <p className="text-sm text-destructive">{errors.loginId}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'SIGN IN'
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign Up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
