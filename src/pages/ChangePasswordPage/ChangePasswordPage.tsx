import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../router/routePaths';
import { useAuthStore } from '../../store/authStore';
import './ChangePasswordPage.css';

function ChangePasswordPage() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn || !user) {
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

  return (
    <main className="change-password-page">
      <h1>Change Password</h1>
      <p>This feature is currently unavailable for customer accounts.</p>
      <button onClick={() => navigate(routePaths.profile)} type="button">
        Back to Profile
      </button>
    </main>
  );
}

export default ChangePasswordPage;
