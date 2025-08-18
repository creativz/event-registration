import { authService } from '../services/authService';

/**
 * Utility function to create an admin user
 * Run this once to set up the initial admin account
 */
export const createAdminUser = async (email: string, password: string) => {
  try {
    console.log('Creating admin user...');
    const user = await authService.createAdminUser(email, password);
    console.log('Admin user created successfully:', user);
    return user;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Example usage:
// createAdminUser('admin@event.com', 'admin123')
//   .then(() => console.log('Admin user created'))
//   .catch(error => console.error('Failed to create admin user:', error));
