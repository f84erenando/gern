import { faker } from '@faker-js/faker';
import { AdminUser } from '../types';
import { User } from '@supabase/supabase-js';

// --- SIMULATED DATABASE ---

// Create a predictable admin user
const adminUser: AdminUser = {
  id: 'admin-user-id',
  full_name: 'Admin GERN',
  email: 'admin@gern.com',
  role: 'admin',
  status: 'active',
  created_at: new Date().toISOString(),
};

// Create other random users
const randomUsers: AdminUser[] = Array.from({ length: 24 }, () => ({
  id: faker.string.uuid(),
  full_name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  role: 'user',
  status: faker.helpers.arrayElement(['active', 'Bloqueado']),
  created_at: faker.date.past().toISOString(),
}));

let mockUsers: AdminUser[] = [adminUser, ...randomUsers];

let currentSession: { user: User, token: string } | null = null;

// Helper to simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// --- MOCK API FUNCTIONS ---

export const mockApi = {
  async getSession() {
    await delay(100);
    return { data: { session: currentSession } };
  },

  async signInWithPassword(email: string, password: string) {
    await delay(1000);
    const user = mockUsers.find(u => u.email === email.toLowerCase());

    if (!user || password !== 'password123') { // Simple password for all users
      return { error: { message: 'Email ou senha inválidos.' } };
    }
    
    const mockUserObject: User = {
        id: user.id,
        app_metadata: {},
        user_metadata: { full_name: user.full_name, email: user.email },
        aud: 'authenticated',
        created_at: user.created_at,
    };

    currentSession = { user: mockUserObject, token: faker.string.uuid() };
    return { data: { session: currentSession }, error: null };
  },

  async signUp(fullName: string, email: string, password: string) {
    await delay(1500);
    if (mockUsers.some(u => u.email === email.toLowerCase())) {
      return { error: { message: 'Um utilizador com este email já existe.' } };
    }
    if (password.length < 6) {
        return { error: { message: 'A senha deve ter pelo menos 6 caracteres.' } };
    }
    const newUser: AdminUser = {
      id: faker.string.uuid(),
      full_name: fullName,
      email: email.toLowerCase(),
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    // We add to the beginning to see it first in the admin panel
    mockUsers.unshift(newUser);
    return { data: {}, error: null };
  },

  async signOut() {
    await delay(500);
    currentSession = null;
    return { error: null };
  },

  async getUserRole(userId: string): Promise<{ role: string | null }> {
    await delay(200);
    const user = mockUsers.find(u => u.id === userId);
    return { role: user?.role || null };
  },

  async getAllUsers(): Promise<{ data: AdminUser[], error: null | { message: string } }> {
    await delay(800);
    // Return a copy to prevent direct mutation, sorted by creation date
    return { data: [...mockUsers].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()), error: null };
  },
  
  async getTotalUsersCount(): Promise<{ count: number, error: null | { message: string } }> {
    await delay(300);
    return { count: mockUsers.length, error: null };
  },

  async updateUserRole(targetUserId: string, newRole: 'admin' | 'user') {
    await delay(700);
    const userIndex = mockUsers.findIndex(u => u.id === targetUserId);
    if (userIndex > -1) {
      mockUsers[userIndex].role = newRole;
      return { error: null };
    }
    return { error: { message: "Utilizador não encontrado." } };
  },

  async updateUserStatus(targetUserId: string, newStatus: 'active' | 'Bloqueado') {
    await delay(700);
    const userIndex = mockUsers.findIndex(u => u.id === targetUserId);
    if (userIndex > -1) {
      mockUsers[userIndex].status = newStatus;
      return { error: null };
    }
    return { error: { message: "Utilizador não encontrado." } };
  }
};
