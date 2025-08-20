import { cleanParams, createNewUserInDatabase, withToast } from "@/lib/utils";
import {
  Admin,
  Propietario,
  Estudiante,
  Conversacion,
  Alojamiento,
} from "@/types/prismaTypes";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { FiltersState } from ".";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      try {
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};
        console.log("Session:", session);
        console.log("ID Token:", idToken);
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken}`);
        }
      } catch (error) {
        console.error("Error obteniendo la sesión:", error);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: [
    "Propietarios",
    "Estudiantes",
    "Alojamientos",
    "Mensajes",
    "Solicitudes",
  ],
  // Dentro de tu createApi
  endpoints: (build) => ({
    getChatMessages: build.query({
      query: (conversacionId) => `/chat/mensajes/${conversacionId}`,
    }),

    sendMessage: build.mutation({
      query: (body) => ({
        url: "/chat/mensajes",
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Mensaje enviado con éxito",
          error: "Error al enviar el mensaje",
        });
      },
    }),


    getUserConversations: build.query<Conversacion[], { userId: number }>({
      query: ({ userId }) => `/chat/conversaciones?usuarioId=${userId}`,
    }),

    createOrGetConversacion: build.mutation<
      { id: number },
      { alojamientoId: number; estudianteId: number; propietarioId: number }
    >({
      query: ({ alojamientoId, estudianteId, propietarioId }) => ({
        url: `/chat/conversaciones`,
        method: "POST",
        body: { alojamientoId, estudianteId, propietarioId },
      }),
      invalidatesTags: [{ type: "Mensajes", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Conversación iniciada",
          error: "Error al crear o conseguir la conversación",
        });
      },
    }),


    marcarComoLeido: build.mutation<
      { message: string },
      { conversacionId: number; usuarioId: number }
    >({
      query: ({ conversacionId, usuarioId }) => ({
        url: `/chat/conversaciones/${conversacionId}/leido`,
        method: "PATCH",
        body: { usuarioId },
      }),
      invalidatesTags: (result, error, { conversacionId }) => [
        { type: "Mensajes", id: conversacionId },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Conversación marcada como leída",
          error: "Error al marcar como leída",
        });
      },
    }),

    getAuthUser: build.query<User, void>({
      queryFn: async (_, _queryApi, _extraoptions, fetchWithBQ) => {
        try {
          const session = await fetchAuthSession();
          const user = await getCurrentUser();

          if (!user?.userId) {
            return { error: "No se ha podido obtener el usuario de Cognito" };
          }

          const endpoints = [
            `/admin/${user.userId}`,
            `/propietaris/${user.userId}`,
            `/estudiante/${user.userId}`,
          ];

          for (const endpoint of endpoints) {
            const response = await fetchWithBQ(endpoint);
            if (!response.error) {
              const userInfo = response.data as Estudiante | Propietario | Admin;
              return {
                data: {
                  cognitoInfo: user,
                  userInfo,
                  userRole: userInfo.tipo,
                },
              };
            }
          }

          // Usuario aún no registrado en la BD
          return { error: "Usuario no registrado en el sistema" };

        } catch (error: any) {
          return { error: error.message || "Error al obtener la info del usuario" };
        }
      },
    }),

    // property related endpoints
    getProperties: build.query<
      Alojamiento[],
      (Partial<FiltersState> & { favoriteIds?: number[] }) | void
    >({
      query: (filters = {}) => {
        const params = cleanParams({
          location: filters?.location,
          precioMin: filters?.rangoPrecio?.[0],
          precioMax: filters?.rangoPrecio?.[1],
          habitaciones: filters?.habitaciones,
          banos: filters?.banos,
          tipoAlojamiento: filters?.tipoAlojamiento,
          superficieMin: filters?.superficie?.[0],
          SuperficieMax: filters?.superficie?.[1],
          amenities: filters?.amenities?.join(","),
          includedExpenses: filters?.includedExpenses?.join(","),
          latitude: filters?.coordinates?.[1],
          longitude: filters?.coordinates?.[0],
          estado: "Aprobado",
        });

        return { url: "alojamientos", params };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Alojamientos" as const, id })),
              { type: "Alojamientos", id: "LIST" },
            ]
          : [{ type: "Alojamientos", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Error al obtener los alojamientos.",
        });
      },
    }),

    getProperty: build.query<Alojamiento, number>({
      query: (id) => `alojamientos/${id}`,
      providesTags: (result, error, id) => [{ type: "Alojamientos", id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Error al cargar los detalles del alojamiento.",
        });
      },
    }),

    // tenant related endpoints
    getTenant: build.query<Estudiante, string>({
      query: (cognitoId) => `estudiante/${cognitoId}`,
      providesTags: (result) => [{ type: "Estudiantes", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Error al cargar el perfil del estudiante.",
        });
      },
    }),

    getCurrentResidences: build.query<Alojamiento[], string>({
      query: (cognitoId) => `estudiante/${cognitoId}/current-residences`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Alojamientos" as const, id })),
              { type: "Alojamientos", id: "LIST" },
            ]
          : [{ type: "Alojamientos", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Error al obtener las residencias actuales.",
        });
      },
    }),

    updateProperty: build.mutation<Alojamiento, FormData>({
      query: (formData) => {
        const alojamientoId = formData.get("alojamientoId");
        return {
          url: `alojamientos/${alojamientoId}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: (result, error, formData) => {
        const id = formData.get("alojamientoId");
        return [
          { type: "Alojamientos", id: "LIST" },
          { type: "Alojamientos", id: Number(id) }, // <- este es el importante
        ];
      }, 
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Alojamiento actualizado correctamente",
          error: "Error al actualizar el alojamiento",
        });
      },
    }),

    deleteProperty: build.mutation<void, number>({
      query: (id) => ({
        url: `alojamientos/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Alojamientos", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Alojamiento eliminado correctamente",
          error: "Error al eliminar el alojamiento",
        });
      },
    }),

    updateStudentSettings: build.mutation<
      Estudiante,
      { cognitoId: string } & Partial<Estudiante>
    >({
      query: ({ cognitoId, ...updatedStudent }) => ({
        url: `estudiante/${cognitoId}`,
        method: "PUT",
        body: updatedStudent,
      }),
      invalidatesTags: (result) => [{ type: "Estudiantes", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Ajustes actualizados correctamente",
          error: "Error al actualizar los ajustes",
        });
      },
    }),

    addFavoriteProperty: build.mutation<
      Estudiante,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `estudiante/${cognitoId}/favoritos/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Estudiantes", id: result?.id },
        { type: "Alojamientos", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Alojamiento agregado a favoritos.",
          error: "Error al marcar el alojamiento como favorito.",
        });
      },
    }),

    removeFavoriteProperty: build.mutation<
      Estudiante,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `estudiante/${cognitoId}/favoritos/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Estudiantes", id: result?.id },
        { type: "Alojamientos", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Alojamiento eliminado de favoritos.",
          error: "Error al eliminar el alojamiento de favoritos.",
        });
      },
    }),

    // manager related endpoints
    getManagerProperties: build.query<Alojamiento[], string>({
      query: (cognitoId) => `propietario/${cognitoId}/alojamientos`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Alojamientos" as const, id })),
              { type: "Alojamientos", id: "LIST" },
            ]
          : [{ type: "Alojamientos", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Error al cargar los alojamientos del propietario.",
        });
      },
    }),

    updateManagerSettings: build.mutation<
      Propietario,
      { cognitoId: string } & Partial<Propietario>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `propietario/${cognitoId}`,
        method: "PUT",
        body: updatedManager,
      }),
      invalidatesTags: (result) => [{ type: "Propietarios", id: result?.id }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Ajustes actualizados correctamente!",
          error: "Error al actualizar los ajustes.",
        });
      },
    }),

    createProperty: build.mutation<Alojamiento, FormData>({
      query: (newProperty) => ({
        url: `alojamientos`,
        method: "POST",
        body: newProperty,
      }),
      invalidatesTags: (result) => [
        { type: "Alojamientos", id: "LIST" },
        { type: "Propietarios", id: result?.propietario?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Alojamiento creado con éxito!",
          error: "Error al crear el alojamiento.",
        });
      },
    }),


    // 🔹 Obtener alojamientos pendientes
    getAlojamientosPendientes: build.query<Alojamiento[], void>({
      query: () => "admin/alojamientos/pendientes",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Alojamientos" as const, id })),
              { type: "Alojamientos", id: "LIST" },
            ]
          : [{ type: "Alojamientos", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Error al cargar alojamientos pendientes.",
        });
      },
    }),

    // 🔹 Aprobar alojamiento
    approveAlojamiento: build.mutation<{ success: boolean }, { id: number; esDestacado: boolean }>({
      query: ({ id, esDestacado }) => ({
        url: `admin/alojamientos/${id}/aprobar`,
        method: "PUT",
        body: { esDestacado }, // ✅ incluir en body
      }),
      invalidatesTags: [{ type: "Alojamientos", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Alojamiento aprobado.",
          error: "Error al aprobar alojamiento.",
        });
      },
    }),


    // 🔹 Rechazar alojamiento
    rejectAlojamiento: build.mutation<{ success: boolean }, { id: number; motivo: string; esDestacado: boolean }>({
      query: ({ id, motivo, esDestacado }) => ({
        url: `admin/alojamientos/${id}/rechazar`,
        method: "PUT",
        body: { motivo, esDestacado },
      }),
      invalidatesTags: [{ type: "Alojamientos", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Alojamiento rechazado.",
          error: "Error al rechazar alojamiento.",
        });
      },
    }),
    // admin related endpoints
    getAdminProperties: build.query<Alojamiento[], void>({
      query: () => `admin/alojamientos`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Alojamientos" as const, id })),
              { type: "Alojamientos", id: "LIST" },
            ]
          : [{ type: "Alojamientos", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          error: "Error al cargar los alojamientos del administrador.",
        });
      },
    }),

  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateStudentSettingsMutation,
  useUpdatePropertyMutation,
  useMarcarComoLeidoMutation,
  useDeletePropertyMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetCurrentResidencesQuery,
  useGetManagerPropertiesQuery,
  useCreatePropertyMutation,
  useGetTenantQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useSendMessageMutation,
  useGetChatMessagesQuery,
  useGetUserConversationsQuery,
  useGetAlojamientosPendientesQuery,
  useApproveAlojamientoMutation,
  useRejectAlojamientoMutation,
  useGetAdminPropertiesQuery,
  useCreateOrGetConversacionMutation
} = api;