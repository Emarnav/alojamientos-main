import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEnumString(str: string) {
  return str.replace(/([A-Z])/g, " $1").trim();
}

export function formatPriceValue(value: number | null, isMin: boolean) {
  if (value === null || value === 0)
    return isMin ? "Cualquier precio mínimo" : "Cualquier precio máximo";
  if (value >= 1000) {
    const kValue = value / 1000;
    return isMin ? `$${kValue}k+` : `<$${kValue}k`;
  }
  return isMin ? `$${value}+` : `<$${value}`;
}

export function cleanParams(params: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(params).filter(
      (
        [_, value]
      ) =>
        value !== undefined &&
        value !== "any" &&
        value !== "" &&
        (Array.isArray(value) ? value.some((v) => v !== null) : value !== null)
    )
  );
}

type MutationMessages = {
  success?: string;
  error: string;
};

export const withToast = async <T>(
  mutationFn: Promise<T>,
  messages: Partial<MutationMessages>
) => {
  const { success, error } = messages;

  try {
    const result = await mutationFn;
    if (success) toast.success(success);
    return result;
  } catch (err) {
    if (error) toast.error(error);
    throw err;
  }
};

export const createNewUserInDatabase = async (
  user: any,
  idToken: any,
  userRole: string,
  fetchWithBQ: any
) => {
  const createEndpoint =
    userRole?.toLowerCase() === "Propietario" ? "/propietario" : "/estudiante";

  const createUserResponse = await fetchWithBQ({
    url: createEndpoint,
    method: "POST",
    body: {
      cognitoId: user.userId,
      nombre: idToken?.payload?.name || "",
      email: idToken?.payload?.email || "",
      telefono: "",
    },
  });

  if (createUserResponse.error) {
    throw new Error("Error al crear el usuario en la base de datos" + createUserResponse.error);
  }

  return createUserResponse;
};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") || "http://localhost:3001";

export function getAbsoluteImageUrls(images: string[] | string): string[] {
  if (Array.isArray(images)) {
    return images.map((img) => `${BASE_URL}${normalizePath(img)}`);
  }

  if (typeof images === "string") {
    return images
      .replace(/[{}]/g, "")
      .split(",")
      .map((img) => `${BASE_URL}${normalizePath(img)}`);
  }

  return [];
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}
