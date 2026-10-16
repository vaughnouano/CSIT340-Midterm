import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Exam 3 - Accessible Form Toolkit (useRef + useState)
export default function Exam3() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [shownPrevious, setShownPrevious] = useState('');

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // previous submitted email: a ref, because changing it should NOT render
  const previousEmail = useRef('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const found = {};
    if (form.name.trim() === '') found.name = 'Name is required.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) found.email = 'Enter a valid email like name@mail.com.';
    if (form.password.length < 8) found.password = 'Password must be at least 8 characters.';
    return found;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate();
    setErrors(found);
    setMessage('');

    // focus the first invalid field: name, email, then password
    if (found.name) return nameRef.current.focus();
    if (found.email) return emailRef.current.focus();
    if (found.password) return passwordRef.current.focus();

    // successful submit: read the ref inside the event handler (allowed)
    setShownPrevious(previousEmail.current);
    previousEmail.current = form.email;
    setMessage(`Registered ${form.name}!`);
    setForm({ name: '', email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-sm space-y-4">
      <h2 className="text-xl font-semibold">Registration Form</h2>

      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" ref={nameRef} value={form.name} onChange={handleChange}
          aria-invalid={!!errors.name} aria-describedby="name-error" />
        <p id="name-error" role="alert" className="text-sm text-destructive">{errors.name}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" ref={emailRef} value={form.email} onChange={handleChange}
          aria-invalid={!!errors.email} aria-describedby="email-error" />
        <p id="email-error" role="alert" className="text-sm text-destructive">{errors.email}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" ref={passwordRef} value={form.password}
          onChange={handleChange} aria-invalid={!!errors.password} aria-describedby="password-error" />
        <p id="password-error" role="alert" className="text-sm text-destructive">{errors.password}</p>
      </div>

      <Button type="submit">Register</Button>

      {message && (
        <div className="space-y-1 text-sm">
          <p className="font-medium text-green-600">{message}</p>
          <p className="text-muted-foreground">Previous submitted email: {shownPrevious || 'none yet'}</p>
        </div>
      )}
    </form>
  );
}
