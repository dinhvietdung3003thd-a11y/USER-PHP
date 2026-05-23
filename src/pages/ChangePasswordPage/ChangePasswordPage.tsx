import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { routePaths } from '../../router/routePaths';
import { useAuthStore } from '../../store/authStore';
import './ChangePasswordPage.css';

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { isLoggedIn, token, user, login } = useAuthStore();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isLoggedIn || !token || !user) {
    return (
      <main className="change-password-page">
        <h1>Change Password</h1>
        <p>Please login to change your password.</p>
        <button onClick={() => navigate(routePaths.login)} type="button">
          Go to Login
        </button>
      </main>
    );
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    try {
      console.log('CHANGE PASSWORD TOKEN:', token);
      const result = await authService.changePassword(token, {
        currentPassword,
        newPassword,
        confirmPassword
      });

      login(result.token, user);
      setSuccessMessage(result.message || 'Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const fallback = 'Unable to change password. Please try again.';
      setErrorMessage(error instanceof Error ? error.message : fallback);
    }
  };

  return (
    <main className="change-password-page">
      <h1>Change Password</h1>

      <form className="change-password-page__form" onSubmit={handleSubmit}>
        <label>
          Current Password
          <input
            required
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </label>

        <label>
          New Password
          <input
            required
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </label>

        <label>
          Confirm New Password
          <input
            required
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
          />
        </label>

        <button type="submit">Update Password</button>
      </form>

      {successMessage ? <p>{successMessage}</p> : null}
      {errorMessage ? <p>{errorMessage}</p> : null}
    </main>
  );
}

export default ChangePasswordPage;
