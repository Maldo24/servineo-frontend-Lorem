'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listForums, createForum } from '@/Components/ask_for_help/forum.service';
import type { ForumThread, ForumCategoria } from '@/Components/ask_for_help/forum.types';
import { FORUMSearch } from '@/Components/ask_for_help/FORUMSearch';
import {
  FORUMCategoryFilter,
  ForumCategoryFilterValue,
} from '@/Components/ask_for_help/FORUMCategoryFilter';
import { FORUMCreateForm } from '@/Components/ask_for_help/FORUMCreateForm';
import { FORUMThreadList } from '@/Components/ask_for_help/FORUMThreadList';

const normalize = (str: string | null | undefined) =>
  (str || "")
    .normalize("NFD") // separa letra + tilde
    .replace(/[\u0300-\u036f]/g, "") // elimina las tildes
    .toLowerCase(); // ignora mayúsculas

export default function ForoDeUsuariosPage() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] =
    useState<ForumCategoryFilterValue>("todas");
  const [threads, setThreads] = useState<ForumThread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState<ForumCategoria | "">("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function loadForums() {
    try {
      setLoading(true);
      setError(null);
      const data = await listForums();
      setThreads(data);
    } catch (err: unknown) {
      let errorMessage = "Error al cargar el foro";
      if (err instanceof Error) errorMessage = err.message;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadForums();
  }, []);

  const filteredThreads = useMemo(() => {
    const q = normalize(query.trim());

    return threads.filter((t) => {
      const title = normalize(t.titulo);
      const description = normalize(t.descripcion);

      const coincideTexto =
        !q || title.includes(q) || description.includes(q);

      const coincideCategoria =
        categoriaFiltro === "todas" || t.categoria === categoriaFiltro;

      return coincideTexto && coincideCategoria;
    });
  }, [threads, query, categoriaFiltro]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!titulo.trim() || !descripcion.trim()) {
      setCreateError("Completa el título y la descripción.");
      return;
    }
    if (!categoria) {
      setCreateError("Selecciona una categoría para tu publicación.");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);
      await createForum({ titulo, descripcion, categoria });
      setShowCreateForm(false);
      setTitulo("");
      setDescripcion("");
      setCategoria("");
      await loadForums();
    } catch (err: unknown) {
      let errorMessage = "Error al crear la publicación";
      if (err instanceof Error) errorMessage = err.message;
      setCreateError(errorMessage);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 relative">
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 text-2xl text-gray-600 hover:text-gray-800 transition"
            aria-label="Volver atrás"
          >
            ←
          </button>

          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-center">
            Foro de Usuarios
          </h1>
          <p className="text-gray-600 text-lg text-center">
            Comparte tus dudas y ayuda a otros usuarios.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* barra de búsqueda + filtros + botón crear */}
          <section className="mb-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
              <FORUMSearch query={query} onChange={setQuery} />

              <button
                type="button"
                onClick={() => setShowCreateForm((v) => !v)}
                className="px-4 py-2 border border-blue-600 rounded-md text-sm bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                {showCreateForm ? "Cerrar formulario" : "Crear publicación"}
              </button>
            </div>
          </section>

          {/* filtro por categoría tipo FAQ */}
          <FORUMCategoryFilter
            selectedCategory={categoriaFiltro}
            onCategoryChange={setCategoriaFiltro}
          />

          {/* formulario crear publicación */}
          <FORUMCreateForm
            show={showCreateForm}
            titulo={titulo}
            descripcion={descripcion}
            categoria={categoria}
            creating={creating}
            error={createError}
            onChangeTitulo={setTitulo}
            onChangeDescripcion={setDescripcion}
            onChangeCategoria={setCategoria}
            onSubmit={handleCreate}
          />

          <hr className="mb-6" />

          {/* listado */}
          <FORUMThreadList
            threads={filteredThreads}
            loading={loading}
            error={error}
            onOpenThread={(id) =>
              router.push(`/ask-for-help/foro-usuario/${id}`)
            }
          />
        </div>
      </div>
    </div>
  );
}