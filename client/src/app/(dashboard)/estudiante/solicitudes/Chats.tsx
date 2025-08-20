"use client";

import Header from "@/components/Header";
import Loading from "@/components/Loading";
import {
  useGetAuthUserQuery,
  useGetUserConversationsQuery,
} from "@/state/api";
import StudentCard from "@/components/StudentCard";

const Chats = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const userId = authUser?.userInfo?.id;

  const {
    data: conversaciones,
    isLoading,
    isError,
  } = useGetUserConversationsQuery({ userId }, { skip: !userId });

  if (isLoading) return <Loading />;
  if (isError || !conversaciones) return <div>Error al obtener las conversaciones</div>;

  return (
    <div className="dashboard-container">
      <Header
        title="Solicitudes"
        subtitle="Alojamientos con los que has contactado"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {conversaciones.map((conv) => (
          <StudentCard
            key={conv.id}
            alojamiento={conv.alojamiento}
            conversacionId={conv.id}
            remitenteId={authUser?.userInfo?.id}
            nombreReceptor={
              conv.propietario?.nombre || conv.estudiante?.nombre || "Usuario"
            }
          />
        ))}
      </div>

    </div>
  );
};

export default Chats;
