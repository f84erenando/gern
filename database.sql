-- GERN - Esquema da Base de Dados MySQL
-- Versão: 1.0
--
-- Este ficheiro contém as instruções SQL para criar a estrutura da base de dados 'gern_db'.
-- Para usar:
-- 1. Aceda ao seu phpMyAdmin (no XAMPP).
-- 2. Selecione a sua base de dados 'gern_db'.
-- 3. Vá à aba "SQL".
-- 4. Copie e cole todo o conteúdo deste ficheiro na caixa de texto.
-- 5. Clique em "Executar" (Go).

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--
-- Esta tabela armazena as informações de todos os utilizadores registados.
--

CREATE TABLE `users` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'ID único do utilizador (UUID)',
  `full_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Nome completo do utilizador',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Email de login (deve ser único)',
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hash da senha do utilizador (use bcrypt)',
  `role` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user' COMMENT 'Função do utilizador (user, admin)',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active' COMMENT 'Estado da conta (active, Bloqueado)',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação da conta'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `videos`
--
-- Esta tabela guarda os detalhes de cada vídeo gerado pelos utilizadores.
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL COMMENT 'ID único do vídeo',
  `user_id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Chave estrangeira para a tabela users',
  `title` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Título do vídeo',
  `status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Gerando...' COMMENT 'Estado da geração (Gerando..., Concluído, Falhou)',
  `thumbnail_url` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL para a miniatura do vídeo',
  `video_url` text COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'URL para o ficheiro de vídeo final',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Data de criação do vídeo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_unique` (`email`);

--
-- Índices para tabela `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id_fk` (`user_id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID único do vídeo';

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
