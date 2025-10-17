import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import UserActionsMenu from './UserActionsMenu';
import { useAuth } from '../../contexts/AuthContext';
import { mockApi } from '../../lib/mockApi';
import { AdminUser } from '../../types';

const UsersTable: React.FC = () => {
  const { user: adminUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    
    const { data, error } = await mockApi.getAllUsers();

    if (error) {
      toast.error("Falha ao carregar usuários: " + error.message);
      console.error(error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return filteredUsers.slice(startIndex, startIndex + usersPerPage);
  }, [filteredUsers, currentPage, usersPerPage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Buscar por nome ou e-mail..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full max-w-sm bg-background border border-border rounded-lg px-4 py-2"
      />
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-background">
            <tr>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Role</th>
              <th scope="col" className="px-6 py-3">Status</th>
              <th scope="col" className="px-6 py-3">Data de Cadastro</th>
              <th scope="col" className="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map(user => (
              <tr key={user.id} className="border-b border-border hover:bg-white/5">
                <td className="px-6 py-4 font-medium">
                  <div>{user.full_name || 'N/A'}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                  </span>
                </td>
                <td className="px-6 py-4">{new Date(user.created_at).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 text-right">
                  {user.id !== adminUser?.id && (
                     <UserActionsMenu user={user} onActionComplete={fetchUsers} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-secondary border border-border disabled:opacity-50 flex items-center gap-1"
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-secondary border border-border disabled:opacity-50 flex items-center gap-1"
          >
            Próximo <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersTable;
