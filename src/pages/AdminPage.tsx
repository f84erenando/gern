import React, { useState, useEffect } from 'react';
import { Users, Video, DollarSign, BarChart2, Loader2 } from 'lucide-react';
import StatCard from '../components/admin/StatCard';
import UsersTable from '../components/admin/UsersTable';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { mockApi } from '../lib/mockApi';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoadingStats(true);
      const { count, error } = await mockApi.getTotalUsersCount();

      if (error) {
        console.error("Erro ao buscar contagem de usuários:", error);
        setTotalUsers(null);
      } else {
        setTotalUsers(count);
      }
      setLoadingStats(false);
    };

    fetchStats();
  }, []);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-secondary border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">GERN - Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Bem-vindo, {user?.user_metadata.full_name || user?.email}</p>
          </div>
          <Link to="/dashboard" className="text-sm hover:underline">Voltar ao Dashboard</Link>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total de Usuários"
            value={loadingStats ? <Loader2 className="h-8 w-8 animate-spin" /> : (totalUsers !== null ? totalUsers.toLocaleString('pt-BR') : 'Erro')}
            icon={<Users className="h-6 w-6 text-muted-foreground" />}
            change={!loadingStats && totalUsers !== null ? "+5.2% (simulado)" : ""}
          />
          <StatCard
            title="Vídeos Gerados (Simulado)"
            value="4,821"
            icon={<Video className="h-6 w-6 text-muted-foreground" />}
            change="+12.8% este mês"
          />
          <StatCard
            title="Arrecadação (Simulado)"
            value="$1,480.00"
            icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
            change="+2.1% este mês"
          />
          <StatCard
            title="Usuários Ativos (Simulado)"
            value="312"
            icon={<BarChart2 className="h-6 w-6 text-muted-foreground" />}
            change="-1.5% vs ontem"
          />
        </div>

        {/* Users Table */}
        <div className="bg-secondary rounded-lg border border-border p-6">
          <h2 className="text-2xl font-bold mb-4">Gerenciamento de Usuários</h2>
          <UsersTable />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
