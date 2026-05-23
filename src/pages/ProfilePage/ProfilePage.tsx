import { useNavigate } from 'react-router-dom';
import { routePaths } from '../../router/routePaths';
import { useAuthStore } from '../../store/authStore';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuthStore();

  if (!isLoggedIn || !user) {
    return (
      <main className="profile-page">
        <h1>Profile</h1>
        <p>Please login to view your profile.</p>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <h1>Profile</h1>

      <div className="profile-page__card">
        <div className="profile-page__avatar-wrap">
          <img
            alt="User avatar"
            className="profile-page__avatar"
            src={user.avatarUrl || '/placeholder-product.png'}
          />
        </div>
        <p>
          <strong>{user.fullName}</strong>
        </p>
        <p>{user.email || 'Email not available'}</p>

        <div className="profile-page__actions">
          <button onClick={() => navigate(routePaths.myOrders)} type="button">
            My Orders
          </button>
          <button disabled title="Feature unavailable" type="button">
            Change Password (Unavailable)
          </button>
          <button
            onClick={() => {
              logout();
              navigate(routePaths.login);
            }}
            type="button"
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}

export default ProfilePage;
