'use client';

import React, { useEffect, useState, useRef } from 'react';
import UserProfileSummary from '@/Components/requester/profile/UserProfileSummary';
import { Bell, BellOff, ShieldCheck, User2, Info } from 'lucide-react';
import { useRouter } from '@/i18n/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '@/app/redux/slice/userSlice';
import { IUser } from '@/types/user';

interface RootState {
  user: {
    user: IUser | null;
    isAuthenticated: boolean;
    loading: boolean;
  };
}

export default function MiPerfilPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user: reduxUser } = useSelector((state: RootState) => state.user);
  const [refresh, setRefresh] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userData, setUserData] = useState<IUser | null>(null);
  const userDataFromStorageRef = useRef(false);

  /* ======================================================
               ✏️ EDICIÓN INLINE DEL PERFIL
  ====================================================== */
  const [editName, setEditName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhotoFile, setEditPhotoFile] = useState<File | null>(null);
  const [savingInline, setSavingInline] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  function safeParse(json: string | null) {
    if (!json) return null;
    try {
      const parsed = JSON.parse(json);
      return typeof parsed === 'object' ? parsed : null;
    } catch {
      return null;
    }
  }
  const loadUserFromStorage = () => {
    const raw = localStorage.getItem('servineo_user');
    const parsed = safeParse(raw);
    if (parsed) {
      const user = parsed as IUser;
      setUserData(user);
      // Sync with Redux
      if (!reduxUser || reduxUser._id !== user._id || reduxUser.id !== user.id) {
        dispatch(setUser(user));
      }
      userDataFromStorageRef.current = true;
      return user;
    }
    userDataFromStorageRef.current = false;
    return null;
  };

  const updateEditableFields = (data: IUser & { firstName?: string; lastName?: string }) => {
    if (!data || hasUnsavedChanges) return;
    if (data.firstName !== undefined || data.lastName !== undefined) {
      setEditName(data.firstName ?? '');
      setEditLastName(data.lastName ?? '');
      setEditEmail(data.email ?? '');
      return;
    }
    if (editName || editLastName) return;

    const full = (data.name || '').trim().replace(/\s+/g, ' ');
    const parts = full.split(' ').filter((p) => p.length > 0);

    if (parts.length === 0) {
      setEditName('');
      setEditLastName('');
    } else if (parts.length === 1) {
      setEditName(parts[0]);
      setEditLastName('');
    } else if (parts.length === 2) {
      setEditName(parts[0]);
      setEditLastName(parts[1]);
    } else if (parts.length === 3) {
      setEditName(parts[0] + ' ' + parts[1]);
      setEditLastName(parts[2]);
    } else if (parts.length === 4) {
      setEditName(parts[0] + ' ' + parts[1]);
      setEditLastName(parts[2] + ' ' + parts[3]);
    } else {
      const apellidos = parts.slice(-2).join(' ');
      const nombres = parts.slice(0, -2).join(' ');
      setEditName(nombres);
      setEditLastName(apellidos);
    }

    setEditEmail(data.email ?? '');
  };

  useEffect(() => {
    const loaded = loadUserFromStorage();

    if (loaded) {
      updateEditableFields(loaded);
    }
  }, []);

  useEffect(() => {
    const handler = () => {
      const loaded = loadUserFromStorage();
      if (loaded) {
        updateEditableFields(loaded);
      }
      setRefresh(Date.now());
    };

    window.addEventListener('servineo_user_updated', handler);
    window.addEventListener('storage', handler);

    const handleFocus = () => {
      const loaded = loadUserFromStorage();
      if (loaded) {
        updateEditableFields(loaded);
      }
    };
    window.addEventListener('focus', handleFocus);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const loaded = loadUserFromStorage();
        if (loaded) {
          updateEditableFields(loaded);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('servineo_user_updated', handler);
      window.removeEventListener('storage', handler);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    const raw = localStorage.getItem('servineo_user');
    const parsed = safeParse(raw);

    if (parsed) {
      const user = parsed as IUser;
      setUserData(user);
      userDataFromStorageRef.current = true;

      // Sync with Redux if different
      if (!reduxUser || reduxUser._id !== user._id || reduxUser.id !== user.id) {
        dispatch(setUser(user));
      }
    } else if (reduxUser) {
      // Use Redux user as fallback
      setUserData(reduxUser);
      userDataFromStorageRef.current = false;
    }
  }, [reduxUser, dispatch]);

  /* ======================================================
                     🔔 NOTIFICACIONES
  ====================================================== */
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('servineo_notifications');
    if (saved === 'true' || saved === 'false') {
      setNotifications(saved === 'true');
    }
  }, []);

  function toggleNotifications() {
    setNotifications((prev) => {
      const next = !prev;
      localStorage.setItem('servineo_notifications', next.toString());
      return next;
    });
  }

  /* ======================================================
               ✏️ EDICIÓN INLINE DEL PERFIL
  ====================================================== */
  useEffect(() => {
    if (hasUnsavedChanges) return;
    if (editName || editLastName) return;

    const raw = localStorage.getItem('servineo_user');
    const parsed = safeParse(raw);

    if (parsed) {
      const parsedName = parsed.name || '';
      const currentFullName = `${editName.trim()} ${editLastName.trim()}`.trim();

      if (parsedName !== currentFullName || (parsed.email || '') !== editEmail) {
        updateEditableFields(parsed as IUser);
      }
    } else if (userData && !userDataFromStorageRef.current) {
      const userDataName = userData.name || '';
      const currentFullName = `${editName.trim()} ${editLastName.trim()}`.trim();

      if (userDataName !== currentFullName || (userData.email || '') !== editEmail) {
        updateEditableFields(userData);
      }
    }
  }, [userData, hasUnsavedChanges, editName, editLastName, editEmail]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setEditPhotoFile(file);
  };

  async function saveProfileInline() {
    try {
      const token = localStorage.getItem('servineo_token');
      if (!token) {
        alert('No autenticado. Por favor, inicia sesión nuevamente.');
        router.push('/login');
        return;
      }

      // Validate we have user data
      if (!userData && !reduxUser) {
        alert('No se encontraron datos del usuario. Por favor, recarga la página.');
        return;
      }

      setSavingInline(true);

      let base64Photo: string | null = null;
      if (editPhotoFile) {
        base64Photo = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(editPhotoFile);
        });
      }

      const fullName = `${editName.trim()} ${editLastName.trim()}`.replace(/\s+/g, ' ').trim();

      function isValidEmail(email: string) {
        if (!email) return false;
        const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return regex.test(email);
      }

      if (!isValidEmail(editEmail.trim())) {
        alert('⚠️ Correo inválido. Debe tener un formato válido (ejemplo: usuario@dominio.com)');
        setSavingInline(false);
        return;
      }

      // Only send photo if it's a new file or if we have a base64 string
      const photoToSend = editPhotoFile
        ? base64Photo
        : (userData?.photo ?? userData?.picture ?? userData?.url_photo ?? null);

      // Build payload - ensure all required fields are present
      const payload: {
        name: string;
        email: string;
        photo?: string | null;
      } = {
        name: fullName,
        email: editEmail.trim(),
      };

      // Only include photo if we have one to send and it's not empty
      if (
        photoToSend &&
        photoToSend.trim() !== '' &&
        photoToSend !== 'null' &&
        photoToSend !== 'undefined'
      ) {
        payload.photo = photoToSend;
      }

      console.log('📤 Enviando actualización de perfil:', {
        name: payload.name,
        email: payload.email,
        hasPhoto: !!payload.photo,
        photoLength: payload.photo?.length || 0,
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/controlC/usuario/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) {
        let errorData;
        try {
          const text = await res.text();
          errorData = text ? JSON.parse(text) : { message: 'Error al actualizar' };
        } catch {
          errorData = { message: `Error ${res.status}: No se pudo actualizar el perfil` };
        }
        console.error('Error al actualizar perfil:', errorData);
        throw new Error(
          errorData.message ||
            errorData.error ||
            `Error ${res.status}: No se pudo actualizar el perfil`,
        );
      }

      const data = await res.json();

      const currentUser: IUser | null = userData || reduxUser;
      const newUser: IUser = {
        ...(currentUser || {}),
        ...(data.user || {}),
        _id: data.user?._id ?? currentUser?._id,
        id: data.user?.id ?? currentUser?.id,
        name: payload.name,
        email: payload.email,
        role: data.user?.role ?? currentUser?.role ?? 'requester',
        photo: payload.photo ?? data.user?.photo ?? currentUser?.photo ?? null,
        picture: payload.photo ?? data.user?.picture ?? currentUser?.picture ?? null,
        url_photo: payload.photo ?? data.user?.url_photo ?? currentUser?.url_photo ?? null,
      };
      // Save to localStorage
      localStorage.setItem('servineo_user', JSON.stringify(newUser));

      // Update Redux
      dispatch(setUser(newUser));

      // Update local state
      setUserData(newUser);
      setHasUnsavedChanges(false);
      setEditPhotoFile(null);

      // Notify other components
      window.dispatchEvent(new Event('servineo_user_updated'));

      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(
          new StorageEvent('storage', {
            key: 'servineo_user',
            newValue: JSON.stringify(newUser),
            storageArea: localStorage,
          }),
        );
      }

      alert('Los cambios se han guardado correctamente');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'No se pudo actualizar el perfil.';
      console.error('Error al guardar perfil:', error);
      alert(errorMessage);
    } finally {
      setSavingInline(false);
    }
  }

  /* ======================================================
         ⚠️ DETECTAR CAMBIOS SIN GUARDAR
  ====================================================== */
  useEffect(() => {
    if (!userData) return;
    const fullName = `${editName.trim()} ${editLastName.trim()}`.replace(/\s+/g, ' ').trim();

    const initialName = userData.name ?? '';
    const initialEmail = userData.email ?? '';
    const nameChanged = fullName !== initialName;
    const emailChanged = editEmail.trim() !== initialEmail;
    const photoChanged = !!editPhotoFile;

    setHasUnsavedChanges(nameChanged || emailChanged || photoChanged);
  }, [editName, editLastName, editEmail, editPhotoFile, userData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  /* ======================================================
                  🗑️ ELIMINAR CUENTA
  ====================================================== */
  async function handleDeleteAccount() {
    try {
      const token = localStorage.getItem('servineo_token');
      if (!token) return alert('Usuario no autenticado');

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/controlC/usuario/delete-account`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        },
      );

      const data = await res.json();
      if (!data.success) {
        alert(data.message || 'No se pudo eliminar la cuenta');
        return;
      }

      // Clear storage
      localStorage.removeItem('servineo_token');
      localStorage.removeItem('servineo_user');

      // Clear Redux
      dispatch(setUser(null));

      alert('Tu cuenta ha sido eliminada');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      alert('Error eliminando la cuenta');
    }
  }

  /* ======================================================
                           UI
  ====================================================== */
  return (
    <main className='min-h-screen bg-gradient-to-br from-[#F5F8FF] to-[#E9EEFA] py-10 px-4 font-roboto'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold mb-10 text-[#16203A] tracking-tight'>Mi perfil</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
          {/* ===================== LADO IZQUIERDO ===================== */}
          <div className='lg:col-span-1'>
            <UserProfileSummary key={refresh} />
          </div>

          {/* ===================== LADO DERECHO ===================== */}
          <div className='lg:col-span-2'>
            <div className='backdrop-blur-md bg-white/60 p-8 rounded-3xl shadow-xl border border-white/40'>
              {/* =================== 🧾 EDITAR PERFIL =================== */}
              <div className='bg-white rounded-2xl p-7 shadow-md border border-gray-100 mb-10'>
                <div className='flex items-center gap-3 mb-4'>
                  <User2 className='text-primary min-w-[24px] min-h-[24px]' size={24} />
                  <h3 className='text-2xl font-semibold text-[#16203A]'>Editar perfil</h3>
                </div>

                <p className='text-sm text-gray-500 mb-8'>
                  Actualiza tu foto, nombre y correo de manera sencilla.
                </p>

                {/* FOTO */}
                <div className='flex items-center gap-6 mb-8'>
                  <div className='relative group'>
                    <img
                      src={
                        editPhotoFile
                          ? URL.createObjectURL(editPhotoFile)
                          : userData?.photo?.trim() ||
                            userData?.picture?.trim() ||
                            userData?.url_photo?.trim() ||
                            '/icons/marcador-de-posicion.png'
                      }
                      className='w-28 h-28 rounded-full object-cover shadow-lg border-2 border-white'
                    />

                    <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 cursor-pointer'>
                      <span className='text-white text-xs font-medium tracking-wide'>
                        Cambiar foto
                      </span>
                    </div>

                    <input
                      type='file'
                      accept='image/*'
                      className='absolute inset-0 opacity-0 cursor-pointer'
                      onChange={handlePhotoUpload}
                    />
                  </div>

                  <div>
                    <p className='font-medium text-gray-700'>Foto de perfil</p>
                    <p className='text-xs text-gray-400'>Formatos PNG o JPG, máx 5 MB</p>
                  </div>
                </div>

                {/* FORMULARIO */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                  <div>
                    <label className='text-sm font-semibold text-[#16203A]'>Nombre</label>
                    <input
                      className='mt-1 p-3 border rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-primary focus:border-primary transition'
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className='text-sm font-semibold text-[#16203A]'>Apellido</label>
                    <input
                      className='mt-1 p-3 border rounded-xl w-full bg-gray-50 focus:ring-2 focus:ring-primary transition'
                      value={editLastName}
                      onChange={(e) => setEditLastName(e.target.value)}
                    />
                  </div>
                </div>
              {/* 
                <div className='mt-5'>
                  <label className='text-sm font-semibold text-[#16203A]'>Correo electrónico</label>
                  <input
                    className='mt-1 p-3 border rounded-xl w-full bg-gray-100 text-gray-600 focus:ring-2 focus:ring-primary transition'
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>*/}

                {/* BOTÓN GUARDAR */}
                <button
                  onClick={saveProfileInline}
                  disabled={savingInline}
                  className='mt-7 w-full py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-xl shadow-lg transition tracking-wide'
                >
                  {savingInline ? 'Guardando…' : 'Guardar cambios'}
                </button>
              </div>

              {/* =================== 🔔 NOTIFICACIONES =================== 
              <div className='p-7 bg-white rounded-2xl border shadow-md mb-10'>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                  <div className='flex items-center gap-4'>
                    <Bell className='text-primary' size={22} />
                    <div>
                      <h3 className='text-lg font-semibold'>Notificaciones</h3>
                      <p className='text-sm text-gray-500'>
                        Activa o desactiva alertas importantes.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={toggleNotifications}
                    className={`self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 rounded-full shadow text-sm font-medium transition ${
                      notifications ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {notifications ? <Bell size={18} /> : <BellOff size={18} />}
                    {notifications ? 'Activadas' : 'Desactivadas'}
                  </button>
                </div>
              </div>*/}

              {/* ===================== 🛡️ SEGURIDAD ===================== */}
              <div className='p-7 bg-white rounded-2xl border shadow mb-10'>
                <div className='flex items-center gap-3 mb-2'>
                  <ShieldCheck className='text-primary min-w-[22px] min-h-[22px]' size={22} />
                  <h3 className='font-semibold text-lg'>Seguridad de la cuenta</h3>
                </div>
                <p className='text-sm text-gray-600'>Tu cuenta está protegida correctamente.</p>
              </div>

              {/* =================== ℹ️ INFORMACIÓN EXTRA =================== */}
              <div className='p-5 bg-white rounded-2xl border shadow mb-10 flex gap-4'>
                <Info className='text-primary min-w-[22px] min-h-[22px]' size={22} />
                <div>
                  <h3 className='font-semibold text-lg'>Configuraciones avanzadas</h3>
                  <p className='text-sm text-gray-600'>
                    Para cambiar <b>teléfono, dirección o contraseña</b>, entra en{' '}
                    <b>Configuración</b>.
                  </p>
                </div>
              </div>

              {/* ===================== 🎛️ BOTONES FINALES ===================== */}
              <div className='flex flex-col sm:flex-row gap-4 sm:gap-3'>
                <button
                  onClick={() => {
                    if (
                      hasUnsavedChanges &&
                      !confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?')
                    )
                      return;
                    router.push('/requesterEdit?section=perfil');
                  }}
                  className='px-6 py-2.5 bg-white border text-primary rounded-full shadow hover:bg-gray-50 transition'
                >
                  Configuración
                </button>

                <button
                  onClick={() => {
                    if (
                      hasUnsavedChanges &&
                      !confirm('Tienes cambios sin guardar. ¿Seguro que quieres salir?')
                    )
                      return;
                    router.push('/');
                  }}
                  className='px-6 py-2.5 bg-primary text-white rounded-full shadow hover:bg-primary/90 transition'
                >
                  Volver al inicio
                </button>

                <button
                  onClick={() => {
                    if (
                      hasUnsavedChanges &&
                      !confirm('Tienes cambios sin guardar. ¿Deseas continuar?')
                    )
                      return;
                    setShowDeleteConfirm(true);
                  }}
                  className='px-6 py-2.5 bg-primary text-white rounded-full shadow hover:bg-primary/90 transition font-medium'
                >
                  Eliminar cuenta
                </button>

                {/* ===================== ❌ MODAL ELIMINAR ===================== */}
                {showDeleteConfirm && (
                  <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[1000]'>
                    <div className='bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/40 w-80 text-center'>
                      <h3 className='text-lg font-semibold text-[#16203A] mb-3'>
                        ¿Está seguro de eliminar su cuenta?
                      </h3>

                      <p className='text-gray-600 mb-6 text-sm'>
                        Esta acción eliminará su cuenta de manera permanente.
                      </p>

                      <div className='flex justify-between gap-3'>
                        <button
                          onClick={() => setShowDeleteConfirm(false)}
                          className='flex-1 py-2.5 rounded-full bg-white border text-primary shadow hover:bg-gray-50 transition font-medium'
                        >
                          Cancelar
                        </button>

                        <button
                          onClick={handleDeleteAccount}
                          className='flex-1 py-2.5 rounded-full bg-primary text-white shadow hover:bg-primary/90 transition font-medium'
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
