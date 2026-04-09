-- TutorLaw Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  nombre text,
  universidad text,
  jurisdiccion text default 'Chile',
  plan text default 'free' check (plan in ('free', 'student', 'university')),
  consultas_mes int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Sessions table (chat sessions)
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  modo text not null check (modo in ('tutor', 'socratico', 'caso', 'debate', 'examen', 'oral', 'ensayo')),
  ramo text default 'general',
  titulo text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Messages table
create table messages (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid references sessions(id) on delete cascade not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Progress table (per subject)
create table progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  ramo text not null,
  consultas int default 0,
  porcentaje int default 0,
  updated_at timestamptz default now(),
  unique(user_id, ramo)
);

-- Achievements/Logros table
create table logros (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade not null,
  logro_id text not null,
  unlocked_at timestamptz default now(),
  unique(user_id, logro_id)
);

-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table sessions enable row level security;
alter table messages enable row level security;
alter table progress enable row level security;
alter table logros enable row level security;

-- RLS Policies for profiles
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- RLS Policies for sessions
create policy "Users can view own sessions"
  on sessions for select
  using (auth.uid() = user_id);

create policy "Users can create own sessions"
  on sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update own sessions"
  on sessions for update
  using (auth.uid() = user_id);

create policy "Users can delete own sessions"
  on sessions for delete
  using (auth.uid() = user_id);

-- RLS Policies for messages
create policy "Users can view messages from own sessions"
  on messages for select
  using (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );

create policy "Users can create messages in own sessions"
  on messages for insert
  with check (
    session_id in (
      select id from sessions where user_id = auth.uid()
    )
  );

-- RLS Policies for progress
create policy "Users can view own progress"
  on progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on progress for update
  using (auth.uid() = user_id);

-- RLS Policies for logros
create policy "Users can view own achievements"
  on logros for select
  using (auth.uid() = user_id);

create policy "Users can insert own achievements"
  on logros for insert
  with check (auth.uid() = user_id);

-- Function to handle new user creation
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nombre, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nombre', new.raw_user_meta_data->>'name', 'Usuario'),
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger update_profiles_updated_at before update on profiles
  for each row execute function update_updated_at_column();

create trigger update_sessions_updated_at before update on sessions
  for each row execute function update_updated_at_column();

create trigger update_progress_updated_at before update on progress
  for each row execute function update_updated_at_column();

-- Indexes for better performance
create index sessions_user_id_idx on sessions(user_id);
create index sessions_created_at_idx on sessions(created_at desc);
create index messages_session_id_idx on messages(session_id);
create index messages_created_at_idx on messages(created_at);
create index progress_user_id_idx on progress(user_id);
create index logros_user_id_idx on logros(user_id);
