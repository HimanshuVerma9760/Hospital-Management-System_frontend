const Conn = import.meta.env.VITE_CONN_URI;

export default async function useAuth() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return { response: false, role: null };
    }
    const response = await fetch(`${Conn}/verify`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.ok) {
      const result = await response.json();
      if (result.response) {
        return {
          response: true,
          role: result.role,
          id: result.id,
          userId: result.userId,
          name: result.name,
        };
      } else {
        return { response: false, role: null, id: null, name: null };
      }
    } else {
      return { response: false, role: null, id: null, name: null };
    }
  } catch (error) {
    console.log(error);
    return { response: false, role: null, id: null, name: null };
  }
}
