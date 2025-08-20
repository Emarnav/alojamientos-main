"use client";

import SettingsForm from "@/components/SettingsForm";
import {
  useGetAuthUserQuery,
  useUpdateStudentSettingsMutation,
} from "@/state/api";
import React from "react";

const StudentSettings = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateStudent] = useUpdateStudentSettingsMutation();

  if (isLoading) return <>Cargando...</>;

  const initialData = {
    name: authUser?.userInfo.name,
    email: authUser?.userInfo.email,
    phoneNumber: authUser?.userInfo.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateStudent({
      cognitoId: authUser!.userInfo!.cognitoId,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="Estudiante"
    />
  );
};

export default StudentSettings;
